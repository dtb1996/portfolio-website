---
title: "Mastering Unreal Engine Container Classes — TArray, TMap, and TSet"
date: "2025-07-18"
description: "Learn how to use C++ container types."
image:
    url: ""
    alt: ""
tags: ["unreal engine", "C++"]
---

Originally posted on [Medium](https://medium.com/@bellefeuilledillon/mastering-unreal-engine-container-classes-tarray-tmap-and-tset-5725c6b011e8)

## Intro

Unreal Engine provides container types like [TArray](https://dev.epicgames.com/documentation/en-us/unreal-engine/array-containers-in-unreal-engine), [TMap](https://dev.epicgames.com/documentation/en-us/unreal-engine/map-containers-in-unreal-engine), and [TSet](https://dev.epicgames.com/documentation/en-us/unreal-engine/set-containers-in-unreal-engine), which are optimized for performance and memory usage. In this tutorial, we will go over how to use each type in C++ using an `ActorComponent`.

## Overview of Unreal’s Container Classes

### TArray

`TArray` is Unreal’s dynamic array container, similar to `std::vector`. It is used to store elements of the **same** type.

**Example: Managing a list of player scores**

```cpp
UPROPERTY()
TArray<int32> PlayerScores;

void AddScore(int32 NewScore)
{
  PlayerScores.Add(NewScore);
}


void PrintScores() const
{
  for (int32 Score : PlayerScores)
  {
    UE_LOG(LogTemp, Log, TEXT("Score: %d"), Score);
  }
}
```

**Useful Tips:**

- `AddUnique()` can be used instead of `Add()`to prevent duplicate entries.
- `RemoveAt(Index)` will delete an entry by index.
- `Find()` will get the index of a value within the array.

### TMap

`TMap` is Unreal’s equivalent of a hash map or dictionary — stored elements are **key/value pairs**.

**Example: Mapping player names to scores**

```cpp
UPROPERTY()
TMap<FString, int32> PlayerScores;

void SetPlayerScore(const FString& PlayerName, int32 Score)
{
  PlayerScores.Add(PlayerName, Score);
}

void PrintAllScores() const
{
  for (const TPair<FString, int32>& Pair : PlayerScores)
  {
    UE_LOG(LogTemp, Log, TEXT("%s: %d"), *Pair.Key, Pair.Value);
  }
}
```

**Useful Tips:**

- `Contains(Key)` can be used to check if a key exists.
- `Remove(Key)` deletes a pair.
- `Find(Key)` returns a pointer to the value associated with the key.

### TSet

`TSet` is the equivalent of a hash set, meaning it only stores **unique** elements.

**Example: Tracking collected item IDs**

```cpp
UPROPERTY()
TSet<int32> CollectedItemIDs;

void CollectItem(int32 ItemID)
{
  if (CollectedItemIDs.Contains(ItemID))
  {
    UE_LOG(LogTemp, Warning, TEXT("Item already collected: %d"), ItemID);
    return;
  }

  CollectedItemIDs.Add(ItemID);
  UE_LOG(LogTemp, Log, TEXT("Collected item: %d"), ItemID);
}
```

**Useful Tips:**

- `Remove(Element)` is used to delete entries.
- `Num()` returns the total element count.
- `Contains(Element)` is used to check for a specific element in the set.

## C++ Actor Component Class Example

### What We’ll Build

A reusable `UContainerDemoComponent`that demonstrates:

- `TArray`: Ordered list of messages
- `TMap`: Mapping player names to scores
- `TSet`: Unique collection of quest tags

This component can be attached to any `AActor` and we will setup log statements to see the changes.

### Step 1: Create the Component

Create a new class `UContainerDemoComponent` that inherits from `UActorComponent`:

![Creating the Actor Component class](/posts/images/unreal-engine-containers/unreal-engine-containers-01.png)

![Naming the Actor Component class](/posts/images/unreal-engine-containers/unreal-engine-containers-01.png)

In the header add the three container properties:

```cpp
protected:
  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Container Demo")
  TArray<FString> Messages;

  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Container Demo")
  TMap<FString, int32> PlayerScores;

  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Container Demo")
  TSet<FName> CollectedQuestTags;
```

I marked these as`protected` so they can only be accessed by instances of this component class or any class that inherits from it. The `UPROPERTY()` macro can be included to add additional variable specifiers and metadata. Here I added the `EditAnywhere` and `BlueprintReadWrite` specifiers, and added a `Category` to display in the Blueprint editor.

Next, add public function definitions to update or add to the data in the containers. I included the `BlueprintCallable` specifier to allow calling these functions from the blueprint graph:

```cpp
public:
  UFUNCTION(BlueprintCallable, Category = "Container Demo")
  void AddMessage(const FString& NewMessage);

  UFUNCTION(BlueprintCallable, Category = "Container Demo")
  void SetScore(const FString& Player, int32 Score);

  UFUNCTION(BlueprintCallable, Category = "Container Demo")
  void CollectQuestTag(FName Tag);
```

Let’s also include a public function that will log the elements/entries within each container:

```cpp
UFUNCTION(BlueprintCallable, Category = "Container Demo")
void PrintAll();
```

Moving over to the source file, let’s implement the functions we have defined:

```cpp
void UContainerDemoComponent::AddMessage(const FString& NewMessage)
{
  Messages.Add(NewMessage);
}

void UContainerDemoComponent::SetScore(const FString& Player, int32 Score)
{
  PlayerScores.Add(Player, Score);
}

void UContainerDemoComponent::CollectQuestTag(FName Tag)
{
  if (CollectedQuestTags.Contains(Tag))
  {
    UE_LOG(LogTemp, Warning, TEXT("Already collected quest tag: %s"), *Tag.ToString());
  }
  else
  {
    CollectedQuestTags.Add(Tag);
    UE_LOG(LogTemp, Log, TEXT("Collected quest tag: %s"), *Tag.ToString());
  }
}
void UContainerDemoComponent::PrintAll()
{
  UE_LOG(LogTemp, Log, TEXT("--- Messages ---"));
  for (const FString& Msg : Messages)
  {
    UE_LOG(LogTemp, Log, TEXT("%s"), *Msg);
  }

  UE_LOG(LogTemp, Log, TEXT("--- Scores ---"));
  for (const auto& Pair : PlayerScores)
  {
    UE_LOG(LogTemp, Log, TEXT("%s: %d"), *Pair.Key, Pair.Value);
  }

  UE_LOG(LogTemp, Log, TEXT("--- Collected Tags ---"));
  for (const FName& Tag : CollectedQuestTags)
  {
    UE_LOG(LogTemp, Log, TEXT("%s"), *Tag.ToString());
  }
}
```

As an example, we can add some data in `BeginPlay`:

```cpp
void UContainerDemoComponent::BeginPlay()
{
  Super::BeginPlay();

  // Initialize with example data
  AddMessage(TEXT("Welcome!"));
  AddMessage(TEXT("Now starting the tutorial mission!"));

  SetScore(TEXT("Andy"), 100);
  SetScore(TEXT("Connie"), 75);

  CollectQuestTag(TEXT("Tutorial_Started"));
}
```

Included below is the full code for the class:

```cpp
//ContainerDemoComponent.h

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "ContainerDemoComponent.generated.h"

UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class UNREALTUTORIALS_API UContainerDemoComponent : public UActorComponent
{
  GENERATED_BODY()

public:
  UContainerDemoComponent();

protected:
  virtual void BeginPlay() override;

  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Container Demo")
  TArray<FString> Messages;

  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Container Demo")
  TMap<FString, int32> PlayerScores;

  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Container Demo")
  TSet<FName> CollectedQuestTags;

public:
  UFUNCTION(BlueprintCallable, Category = "Container Demo")
  void AddMessage(const FString& NewMessage);

  UFUNCTION(BlueprintCallable, Category = "Container Demo")
  void SetScore(const FString& Player, int32 Score);

  UFUNCTION(BlueprintCallable, Category = "Container Demo")
  void CollectQuestTag(FName Tag);

  UFUNCTION(BlueprintCallable, Category = "Container Demo")
  void PrintAll();
};
```

```cpp
//ContainerDemoComponent.cpp

#include "ContainerDemoComponent.h"

UContainerDemoComponent::UContainerDemoComponent()
{
  PrimaryComponentTick.bCanEverTick = false;
}


void UContainerDemoComponent::BeginPlay()
{
  Super::BeginPlay();

  // Initialize with example data
  AddMessage(TEXT("Welcome!"));
  AddMessage(TEXT("Now starting the tutorial mission!"));

  SetScore(TEXT("Andy"), 100);
  SetScore(TEXT("Connie"), 75);

  CollectQuestTag(TEXT("Tutorial_Started"));
}

void UContainerDemoComponent::AddMessage(const FString& NewMessage)
{
  Messages.Add(NewMessage);
}

void UContainerDemoComponent::SetScore(const FString& Player, int32 Score)
{
  PlayerScores.Add(Player, Score);
}

void UContainerDemoComponent::CollectQuestTag(FName Tag)
{
  if (CollectedQuestTags.Contains(Tag))
  {
    UE_LOG(LogTemp, Warning, TEXT("Already collected quest tag: %s"), *Tag.ToString());
  }
  else
  {
    CollectedQuestTags.Add(Tag);
    UE_LOG(LogTemp, Log, TEXT("Collected quest tag: %s"), *Tag.ToString());
  }
}

void UContainerDemoComponent::PrintAll()
{
  UE_LOG(LogTemp, Log, TEXT("--- Messages ---"));
  for (const FString& Msg : Messages)
  {
    UE_LOG(LogTemp, Log, TEXT("%s"), *Msg);
  }

  UE_LOG(LogTemp, Log, TEXT("--- Scores ---"));
  for (const auto& Pair : PlayerScores)
  {
    UE_LOG(LogTemp, Log, TEXT("%s: %d"), *Pair.Key, Pair.Value);
  }

  UE_LOG(LogTemp, Log, TEXT("--- Collected Tags ---"));
  for (const FName& Tag : CollectedQuestTags)
  {
    UE_LOG(LogTemp, Log, TEXT("%s"), \*Tag.ToString());
  }
}
```

**Note:** be sure to replace `UNREALTUTORIALS_API` with the correct macro for your module if copying this code. If you created the component by adding the class from the Editor this will be all set.

### Step 2: Test In-Game

Attach the `ContainerDemoComponent` to any `Actor`. I added it to a player character:

![Finding the ContainerDemo component](/posts/images/unreal-engine-containers/unreal-engine-containers-03.png)

![ContainerDemo component attached to the player character](/posts/images/unreal-engine-containers/unreal-engine-containers-04.png)

With the `ContainerDemoComponent` selected, we can check the `Details` panel to see the three containers we created. Since they were marked as `EditAnywhere`, you could even add data in the editor at this point:

![ContainerDemoComponent containers listed in the Details panel](/posts/images/unreal-engine-containers/unreal-engine-containers-05.png)

Add an instance of the actor into the level (if it is not setup to spawn in like my player character is) and check the **Output Log** to verify that the example data was added. Since we did not add a call to `PrintAll()` in C++, let’s add one in Blueprints. Here it’s setup to fire when the **Q** key is pressed:

![Key pressed event calling the PrintAll demo function](/posts/images/unreal-engine-containers/unreal-engine-containers-06.png)

Now play the game and trigger `PrintAll()`:

```bash
LogTemp: --- Messages ---
LogTemp: Welcome!
LogTemp: Now starting the tutorial mission!
LogTemp: --- Scores ---
LogTemp: Andy: 100
LogTemp: Connie: 75
LogTemp: --- Collected Tags ---
LogTemp: Tutorial_Started
```

### Final Thoughts

Using containers is an essential part of game development and the built-in options included in Unreal Engine offer a clean and efficient method of doing so. By wrapping the examples above into a component, you’ve written modular functionality that can be reused and attached to any actor.

Containers can also be expanded into more complex structures and can even be included within other containers. `TMap<FString, TArray<FName>>` is just one example of this. Integrating container logic can be used to extend game systems like inventories, save data, and AI behaviors.
