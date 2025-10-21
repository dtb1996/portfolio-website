---
title: "Using Interfaces in Unreal Engine"
date: "2025-06-05"
description: "Learn how to use create and use interfaces in Blueprints and C++."
image:
    url: ""
    alt: ""
tags: ["unreal engine", "C++", "Blueprint", "Interfaces"]
---

Originally posted on [Medium](https://medium.com/@bellefeuilledillon/interfaces-in-unreal-engine-942c0f39a91e)

## Intro

An interface allows different classes to share a common set of functions without being directly related through inheritance. It’s ideal for decoupling systems — such as calling an Interact() function on anything that is interactable without having to first cast that actor or object to a specific class. This tutorial will go over the interface setup and usage in both Blueprints and C++.

## Blueprint Setup

First, let’s create an interface class. Right-click in the desired folder within the Content Browser and select **Blueprint > Blueprint Interface**:

![Creating a Blueprint class](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-01.png)

I’m going to name it **I_Interact**:

![I_Interact Blueprint class](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-02.png)

Once the Blueprint class is opened, you will notice that the graph is read-only. In an interface class you declare the functions (names, inputs, outputs), but the actual function can only be defined from within classes that implement the interface.

I’m going to add a new function named **Interact:**

![Adding a Blueprint Interact function](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-03.png)

For this example, I’ll add an input that allows us to pass in a reference to the actor that calls the function:

![Caller actor function input](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-04.png)

Now we can define a class that implements the Interact interface. Start by creating a new **Actor** blueprint class named **BP_InteractableActor**:

![BP_InteractableActor Blueprint class](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-05.png)

The interface can be attached to this class by going to the **Class Settings** and adding it using the **Implemented Interfaces** dropdown in the **Details** panel:

![Class Settings button](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-06.png)

![Interfaces section in the Details panel](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-07.png)

There should now be an **INTERFACES** section with the **Interact** function listed in the **My Blueprint** panel:

![List of implemented interface functions](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-08.png)

Right-click the **Interact** function and select **Implement event** (or simply double click the function):

![Right-click to implement interface event/function](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-09.png)

This will create a new event node with the interface icon in the top right:

![Implemented interface event](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-10.png)

**Note**: if the interface function has a return value, a function will be created instead of an event.

To test, let’s add a **Print String** node that outputs the message “[Caller] interacted with [This actor’s name]”:

![Test interact event with Print String](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-11.png)

I’ll also add a cube component to give this actor a visual reference when it is instanced in the world:

![Attached cube component to help visualize the actor](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-12.png)

Now we need to call the **Interact** function from somewhere. I’ll do this in the the starter **BP_FirstPersonCharacter**. The following nodes will send out a line trace from the camera component when the player presses E on the keyboard:

![Key press event with Line Trace by Channel](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-13.png)

Using the **Out Hit** pin and breaking the **Hit Result**, we can send out the **Interact** interface message to any hit actor, passing in self as the **Caller** input:

![Getting the Hit Actor from the line trace](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-14.png)

Now the function will be called for any actor that has implemented it, otherwise nothing will happen at all. We can test this by adding a cube to the level, walking up to it, and pressing **E**. You should see the printed message onscreen:

![Example log printed to the screen](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-15.png)

With this interface you can setup all kinds of interactions with various actors in the scene — the function implemented in each class will dictate the behavior.

For a more concrete example, let’s create a door actor that the player can open and close. First, create a new Actor Blueprint class, **BP_DoorActor**, and add the **I_Interact** interface as before.

Here is the component hierarchy I’m using for this class. I have a **Box Collision** and **Static Meshes** for the door and frame:

![DoorActor component hierarchy](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-16.png)

The **Box Collision** is set to Block Visibility trace responses:

![DoorActor collision setup](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-17.png)

**Note**: this component isn’t required, I’m just using it to make it easier for the line trace to hit the actor.

The door and frame are positioned as expected, just make sure that the door model’s pivot matches where the hinges would be:

![Adjusted DoorActor transform pivot](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-18.png)

Next, create a **Timeline** to control the door rotation:

![OpenDoor Timeline node](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-19.png)

Add a **float** track and set the desired start and stop rotations. My door is rotated 90 degrees by default when closed, so I’m using 90.0 as a starting point and 180.0 as the end after 1 second:

![OpenDoor Timeline float track](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-20.png)

Implement the **Interact** event and add a bool variable **bIsOpen** to track the door’s opened status. In the event, first check if opened and call **Play** or **Reverse** accordingly:

![Implemented Interact event with door open check and OpenDoor Timeline](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-21.png)

From the **Update** pin, we can set the **Door** component’s relative rotation. We only want to change the **Z** rotation, so make a rotator out of the current **X** and **Y** and use the **DoorRotation** as the **Z**:

![Using the Timeline to update the door's rotation](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-22.png)

Finally, from the **Finished** pin, update the **bIsOpen** variable:

![Setting IsOpen when the Timeline finishes playing](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-23.png)

**Note**: this will only let you interact with the door again once the timeline has finished. If you want to be able to change the direction of the door mid-animation, you can set **bIsOpen** before the timeline is called:

![Updated interact logic to allow changing the door direction while mid-animation](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-24.png)

The logic setup in the character stays exactly the same. Now we can walk up to the door and press E to interact with it:

![DoorActor placed in the game world](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-25.png)

![Opening the door with the Interact event](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-26.png)

## C++ Setup

First, add a new C++ class using the [C++ Class Wizard](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-cplusplus-class-wizard-in-unreal-engine). I created a class of the base `Object` type named `InteractInterface`:

![Creating the InteractInterface C++ class](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-27.png)

Unreal will create a .h and .cpp file — delete the .cpp file unless you want to provide default function implementations (which can also be done in the header). Next, generate Visual Studio project files. You will need to update the `InteractInterface.h` file, this is the basic setup:

```cpp
//InteractInterface.h

#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "InteractInterface.generated.h"

UINTERFACE(MinimalAPI)
class UInteractInterface : public UInterface
{
  GENERATED_BODY()
};

class IInteractInterface
{
  GENERATED_BODY()

public:
  // Add interface function declarations here
};
```

The `UINTERFACE` macro defines the interface type for the UObject system. You can add the `Blueprintable` specifier if you want to implement this interface in Blueprint classes:

```cpp
UINTERFACE(MinimalAPI, Blueprintable)
```

`IInteractInterface` is the actual C++ interface. This is where function declarations will be added. Let’s add an `Interact` function declaration to the `public` section:

```cpp
public:
  void Interact(AActor* Caller);
```

We’ll add the `UFUNCTION` macro to allow **Blueprint classes** to implement and call this function:

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Interaction")
void Interact(AActor* Caller);
```

Now we can build and open the editor, and add an actor C++ class:

![Creating the InteractableActor C++ class](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-28.png)

```cpp
// InteractableActor.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "InteractableActor.generated.h"

UCLASS()
class UNREALTUTORIALS_API AInteractableActor : public AActor
{
  GENERATED_BODY()

public:

};
```

```cpp
// InteractableActor.cpp

#include "InteractableActor.h"
```

To implement the interface, we first have to add include it in the header:

```cpp
#include "InteractInterface.h"
```

And add the interface name to the end of the class declaration line:

```cpp
class UNREALTUTORIALS_API AInteractableActor : public AActor, public IInteractInterface
```

Finally, we can implement the `Interact` function:

```cpp
public:
  virtual void Interact_Implementation(AActor* Caller) override;
```

We’ll also add a default function implementation in the .cpp file:

```cpp
void AInteractableActor::Interact_Implementation(AActor* Caller)
{
  UE_LOG(LogTemp, Warning, TEXT("%s interacted with %s"), *Caller->GetName(), *GetName());
}
```

The `_Implementation` function is needed here since we marked it as a `BlueprintNativeEvent` in the interface class.

This what the two files should look like:

```cpp
// InteractableActor.h

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "InteractInterface.h"
#include "InteractableActor.generated.h"

UCLASS()
class UNREALTUTORIALS_API AInteractableActor : public AActor, public IInteractInterface
{
  GENERATED_BODY()

public:
  virtual void Interact_Implementation(AActor* Caller) override;
};
```

```cpp
// InteractableActor.cpp

#include "InteractableActor.h"

void AInteractableActor::Interact_Implementation(AActor* Caller)
{
  UE_LOG(LogTemp, Warning, TEXT("%s interacted with %s"), *Caller->GetName(), \*GetName());
}
```

Now we need to call the interface. To keep things simple, I’ll add a `TryInteract` function to the parent class of the default `FirstPersonCharacter` Blueprint that was automatically added to the project:

```cpp
protected:
  UFUNCTION(BlueprintCallable)
  void TryInteract(AActor\* TargetActor);
```

**Note**: this function is not tied to the interface directly, I’m just using this as a function that the child Blueprint class can call from the line trace hit we created earlier.

In the .cpp file, be sure to add an `#include` statement for the interface:

```cpp
#include "InteractInterface.h"
```

And finally, add a definition for `TryInteract()`:

```cpp
void AUnrealTutorialsCharacter::TryInteract(AActor\* TargetActor)
{
  if (TargetActor && TargetActor->GetClass()->ImplementsInterface(UInteractInterface::StaticClass()))
  {
    IInteractInterface::Execute_Interact(TargetActor, this);
  }
}
```

Here, `ImplementsInterface` checks if the object supports the interface. `Execute_Interact` calls the interface function.

Back in the editor, we can call `TryInteract()`, passing in the **HitActor** from the **HitResult** of the line trace:

![Calling TryInteract from Blueprints](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-29.png)

Next, open **BP_InteractableActor** and change the parent to be the `InteractableActor` C++ class:

![Reparenting BP_InteractableActor to the InteractableActor C++ class](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-30.png)

You will see that the C++ `InteractInterface` has been inherited under **Class Settings > Interfaces > Inherited Interfaces**:

![The InteractInterface is inherited from InteractableActor](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-31.png)

When we walk up to the **BP_InteractableActor** cube in the world and press E, the following will show up in the log:

```cpp
BP_FirstPersonCharacter0 interacted with InteractableActor
```

We can also override the default implementation in **BP_InteractableActor** as before:

![The inherited Interact function](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-32.png)

![Overriding the default implementation](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-33.png)

**Note**: you may need to rename the Blueprint interact function from before if **BP_InteractableActor** also implements that interface, otherwise it may not show up:

![Renaming the previous Blueprint interact function to avoid naming conflicts](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-34.png)

I’ll add a simple **PrintString** to demonstrate the event override:

![Demo Interact Event Blueprint override](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-35.png)

![Print String shown on screen](/posts/images/unreal-engine-interfaces/unreal-engine-interfaces-36.png)

We’ve now built a reusable **Interact()** interface that works across any object type in both Blueprints and C++. Your door, pickups, levers, or NPCs can all implement the same interaction logic and be used consistently from player code.
