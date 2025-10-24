---
title: "UE5 Multiplayer: Turn-Based Attempt Timer UI"
date: "2025-10-23"
description: "Learn how to create a syncronized attempt timer widget for multiplayer in UE5."
image:
    url: ""
    alt: ""
tags: ["Unreal Engine", "C++", "Blueprints", "UI", "Multiplayer"]
---

## Intro

Recently, I have been working on a turn-based mini golf game in UE5 and have taken this opportunity to finally dive into online multiplayer programming. While it seemed daunting at first, after working at it for a few months and spending a lot of time experimenting with Unreal’s built-in networking features, I now have a pretty good handle on the system.

Over the summer, I spent a few weeks refactoring the existing systems to clean up a lot of the code that was put together when the game only supported singleplayer. The initial multiplayer logic was kind of just piled on top of the existing framework and was constantly breaking so I knew it was time to redo everything. Now I know why it is generally recommended to build around multiplayer from the beginning, rather than add it in later.

One area that was included in this cleanup was the in-game UI. During each player’s turn, while they are actively attempting to clear the stage, I needed every client to see the same details specific to that active player—current score, coins collected, and the attempt timer. The attempt timer was a bit tricky as this required all clients to sync the allowed time to complete the stage, the attempt start time, and the current world time. These three values are used to calculate the remaining time to display.

In this post I’ll go over my solution for this issue and provide some code samples for anyone who is looking to implement a replicated UI timer in their multiplayer game.

## Basic Setup

The turn-based framework for my game uses the `GameMode` class to cycle through each connected player on the current stage and sets a replicated variable in the `GameState` class to track the active player by storing a reference to their `PlayerState` class. The server copy of the active `PlayerState` class handles its own attempt timer and two replicated properties, `StageTimeLimitSeconds` and `AttemptStartTime`, are available to all connected clients. The following logic is part of the `StartAttemptTimer` function in `PlayerState` that is called by the `GameMode`:

![StartAttemptTimer Blueprint function](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-01.png)

```cpp
void AGolfPlayerState::StartAttemptTimer()
{
  AttemptStartTime = GetWorld()->GetTimeSeconds();
  GetWorld()->GetTimerManager().SetTimer(AttemptTimerHandle, this, &AGolfPlayerState::OnAttemptTimeUp, StageTimeLimitSeconds, false);
}
```

In my game, I also need to notify the `GameMode` that the attempt has started. That logic is routed through a server function on the the `PlayerController` following the `StartAttemptTimer` code above:

```cpp
AGolfPlayerController\* GPC = Cast<AGolfPlayerController>(GetPlayerController());
if (!GPC)
{
  UE_LOG(LogTemp, Warning, TEXT("StartAttemptTimer: GolfPlayerController not found"));
  return;
}

GPC->Server_NotifyAttemptStarted();
```

## Attempt Timer C++ Class

Next, we need to create a timer widget to display on screen. This does require a bit of C++ logic, as the `GetServerWorldTimeSeconds()` function we need from `GameStateBase` is not exposed to Blueprints by default (at least in version 5.4). I chose to set this up in a `UserWidget` parent class that the attempt timer Blueprint widget could inherit from, but you could also add a wrapper function in your `GameState` class and expose it to Blueprints.

First, create a new C++ class of type `UserWidget` called `AttemptTimer`:

```cpp
// AttemptTimer.h
#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "AttemptTimer.generated.h"

UCLASS()
class MULTIPLAYERTEST_API UAttemptTimer : public UUserWidget
{
  GENERATED_BODY()

};

// AttemptTimer.cpp
#include "AttemptTimer.h"
```

In the header I’m going to first mark the class as `Abstract` so that it cannot be instanced directly (this step is optional):

```cpp
UCLASS(Abstract)
```

Next we will need to override `NativeTick`:

```cpp
protected:
  virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override;
```

Finally, let’s add three float properties that will be used to calculate the remaining time. `AttemptStartTime` and `AttemptDuration` will need to be marked as `BlueprintReadWrite` so they can be set in the Blueprint graph later. `AttemptingRemaing` can be marked `BlueprintReadOnly` since it should only be set here in C++:

```cpp
protected:
  UPROPERTY(BlueprintReadWrite)
  float AttemptStartTime = 0.0f;

  UPROPERTY(BlueprintReadWrite)
  float AttemptDuration = 0.0f;

  UPROPERTY(BlueprintReadOnly)
  float AttemptRemaining = 0.0f;
```

Here is the update header file:

```cpp
#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "AttemptTimer.generated.h"

UCLASS(Abstract)
class MULTIPLAYERTEST_API UAttemptTimer : public UUserWidget
{
  GENERATED_BODY()

protected:
  virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override;

  UPROPERTY(BlueprintReadWrite)
  float AttemptStartTime = 0.0f;

  UPROPERTY(BlueprintReadWrite)
  float AttemptDuration = 0.0f;

  UPROPERTY(BlueprintReadOnly)
  float AttemptRemaining = 0.0f;
};
```

Over in the implementation file, we need to add an include for `GameStateBase.h` since we will be calling a function from there:

```cpp
#include "GameFramework/GameStateBase.h"
```

We can also define the overridden `NativeTick` function here:

```cpp
void UAttemptTimer::NativeTick(const FGeometry& MyGeometry, float InDeltaTime)
{
  Super::NativeTick(MyGeometry, InDeltaTime);

  AGameStateBase* GS = GetWorld()->GetGameState();
  if (!GS)
  {
    return;
  }

  float ServerNow = GS->GetServerWorldTimeSeconds();
  float TimeSinceStart = ServerNow - AttemptStartTime;
  AttemptRemaining = FMath::Max(0.0f, AttemptDuration - TimeSinceStart);
}
```

Looking at the definition of `GetServerWorldTimeSeconds()` in `GameStateBase.h`, we see that this method returns the synchronized world time in seconds (time since the world was started):

```cpp
/** Returns the simulated TimeSeconds on the server, will be synchronized on client and server **/
UFUNCTION(BlueprintCallable, Category=GameState)
ENGINE_API virtual double GetServerWorldTimeSeconds() const;
```

This is stored as `ServerNow` in our class, which is used to calculate the time remaining using the `AttemptStartTime` and `AttemptDuration` properties (which will be set in the Blueprint child class):

```cpp
float ServerNow = GS->GetServerWorldTimeSeconds();
float TimeSinceStart = ServerNow - AttemptStartTime;
AttemptRemaining = FMath::Max(0.0f, AttemptDuration - TimeSinceStart);
```

Here is the final code:

```cpp
#include "AttemptTimer.h"
#include "GameFramework/GameStateBase.h"

void UAttemptTimer::NativeTick(const FGeometry& MyGeometry, float InDeltaTime)
{
  Super::NativeTick(MyGeometry, InDeltaTime);

  AGameStateBase* GS = GetWorld()->GetGameState();
  if (!GS)
  {
    return;
  }

  float ServerNow = GS->GetServerWorldTimeSeconds();
  float TimeSinceStart = ServerNow - AttemptStartTime;
  AttemptRemaining = FMath::Max(0.0f, AttemptDuration - TimeSinceStart);
}
```

## WBP_AttemptTimer Setup

Moving back into the editor, we need to create a new timer widget. For that, I added a new `UserWidget` class derived from our `AttemptTimer` class called `WBP_AttemptTimer` and setup a simple layout with two text components, `SecondsText` and `MillisecondsText`, since my game is focused on precise timing. Feel free to omit `MillisecondsText` if your game does not require it:

![WBP_AttemptTimer component hierarchy](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-02.png)

![Attempt timer UI](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-03.png)

Below are the settings I used for the Border and Text components:

![Border style settings](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-04.png)

![SecondsText style settings](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-05.png)

![MillisecondsText style settings](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-06.png)

Moving over to the `EventGraph`, I added a `PlayerState` property (using my custom `PlayerState` class) and marked it as `InstanceEditable` and `ExposeOnSpawn`, this will allow us to set the reference when the widget is added to the screen:

![ActivePlayerState property details](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-07.png)

In `EventConstruct`, we can now set the `AttemptDuration` and `AttemptStartTime` properties from the parent C++ class:

![EventConstruct logic](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-08.png)

I’ve also added a function, `UpdateTimerDisplay`, that formats the `AttemptRemaining` value into strings for the two text components:

![UpdateTimerDisplay function used to build SecondsText and MillisecondsText](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-09.png)

This function builds two strings in the format I need for the timer and adds leading zeros so visual component resizes are avoided. `SecondsText` should always have three digits, while `MillisecondsText` should have a decimal point followed by two digits.

I added this function to `EventConstruct` so that the timer displays the max time when first added to the screen:

![Updated EventConstruct with call to UpdateTimerDisplay](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-10.png)

And with that, the last thing to do is to call `UpdateTimerDisplay` from `EventTick` and pass in the `AttemptRemaining` time from the parent class. Be sure to include the call to the parent tick function by right-clicking the `EventTick` node and selecting “Add call to Parent Function” so that the C++ tick fires correctly:

![EventTick with calls to parent tick and UpdateTimerDisplay function](/posts/images/unreal-engine-turn-based-timer-ui/unreal-engine-turn-based-timer-ui-11.png)
