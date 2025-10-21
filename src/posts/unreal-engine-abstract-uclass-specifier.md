---
title: "The Unreal Engine Abstract UCLASS Specifier"
date: "2025-05-27"
description: "Learn how to use the Abstract specifier in Unreal Engine projects."
image:
    url: ""
    alt: ""
tags: ["unreal engine", "C++", "Abstract Class"]
---

Originally posted on [Medium](https://medium.com/@bellefeuilledillon/the-unreal-engine-abstract-uclass-specifier-43e4f2239cae)

## Intro

When working with C++ in Unreal Engine, [Class Specifiers](https://dev.epicgames.com/documentation/en-us/unreal-engine/class-specifiers) can be a useful tool to change how a given class behaves or how it is treated by the engine. One that I find myself using quite often is the `Abstract` specifier. This allows you to define abstract base classes that are not intended to be added to the game directly — instead the functionality can be inherited and extended by derived classes.

Abstract classes are a common programming practice and are straightforward to implement in Unreal. I’ll demonstrate how to setup one and give an example of where it might be useful.

Here we have the header file for a simple `Actor` class, `AWeaponBase`, which can be used to defined the common components and functionality that all weapons in a game will have:

```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WeaponBase.generated.h"

UCLASS()
class CPPTUTORIAL_API AWeaponBase : public AActor
{
  GENERATED_BODY()

public:
  // Sets default values for this actor's properties
  AWeaponBase();

protected:
  // Called when the game starts or when spawned
  virtual void BeginPlay() override;

public:
  // Called every frame
  virtual void Tick(float DeltaTime) override;
};
```

With the class in its current state, if we go back into the editor and drag it into our level Unreal will let us add an instance because it is treated as a normal Actor class. We won’t see a new object or mesh in the level, since this is a basic class without any defined components, but it will show up in the Outliner hierarchy so we know it was added to the scene:

![World Outliner in Unreal Engine with WeaponBase class instance](/posts/images/unreal-engine-abstract-uclass-specifier/unreal-engine-abstract-uclass-specifier-01.png)

We can define components, like a static mesh and a collider, and functions, such as Fire() or Break(), that derived weapon classes can implement depending on what is needed for the each use case. However, we do not want to have instances of this class directly in the scene, only classes that inherit from it. This is where the `Abstract` specifier comes in.

To declare WeaponBase as an abstract class, simply add the `Abstract` specifier to the `UCLASS()` macro at the top:

```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WeaponBase.generated.h"

UCLASS(Abstract) // Add the Abstract specifier here

...
```

Now Unreal will see that this class should be treated as a base class and will prevent us from instancing it in our levels. The engine will even give a warning in the Output log, letting us know why the actor was unable to be added to the level:

![Attempting to Spawn Abstract class console warning](/posts/images/unreal-engine-abstract-uclass-specifier/unreal-engine-abstract-uclass-specifier-02.png)

I’ll go ahead and add some example components and functions to the base class that can be customized in child classes:

```cpp
// WeaponBase.h

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/CapsuleComponent.h"
#include "WeaponBase.generated.h"

UCLASS(Abstract)
class UNREALTUTORIALS_API AWeaponBase : public AActor
{
  GENERATED_BODY()

public:
  AWeaponBase();

protected:
  virtual void BeginPlay() override;

  UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
  UCapsuleComponent* CapsuleCollision;

  UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
  UStaticMeshComponent* WeaponMesh;

  UFUNCTION(BlueprintImplementableEvent)
  void Fire();

  UFUNCTION(BlueprintImplementableEvent)
  void Break();

public:
  virtual void Tick(float DeltaTime) override;
};
```

```cpp
// WeaponBase.cpp

#include "WeaponBase.h"
#include "Components/StaticMeshComponent.h"

AWeaponBase::AWeaponBase()
{
  PrimaryActorTick.bCanEverTick = true;

  CapsuleCollision = CreateDefaultSubobject<UCapsuleComponent>(TEXT("CapsuleCollision"));
  RootComponent = CapsuleCollision;

  WeaponMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("WeaponMesh"));
  WeaponMesh->SetupAttachment(CapsuleCollision);
}

void AWeaponBase::BeginPlay()
{
  Super::BeginPlay();
}

void AWeaponBase::Tick(float DeltaTime)
{
  Super::Tick(DeltaTime);
}
```

When we go to create a child Blueprint class, we can pick the WeaponBase class to inherit from:

![Selecting WeaponBase as the parent class](/posts/images/unreal-engine-abstract-uclass-specifier/unreal-engine-abstract-uclass-specifier-03.png)

Opening up the child class, you can see all of the inherited properties and functions that were defined in the base C++ class (provided you marked those with Blueprint visibility):

![Inherited components defined in parent C++ class](/posts/images/unreal-engine-abstract-uclass-specifier/unreal-engine-abstract-uclass-specifier-04.png)

![Inherited functions defined in parent C++ class](/posts/images/unreal-engine-abstract-uclass-specifier/unreal-engine-abstract-uclass-specifier-05.png)

These can be overridden to customize the weapon specific to its use case.

And that’s the basic setup. Using the Abstract specifier can help keep your project neat and organized and also prevent accidently adding base classes to game world.

**Bonus tip:** if you are defining a Blueprint base class, it can be set as an abstract class by toggling the `Generate Abstract Class` option found in the Class Settings:

![The "Generate Abstract Class" option in a Blueprint class](/posts/images/unreal-engine-abstract-uclass-specifier/unreal-engine-abstract-uclass-specifier-06.png)
