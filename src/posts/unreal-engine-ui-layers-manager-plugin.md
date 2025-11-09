---
title: "UE5: UI Layers Manager Plugin"
date: "2025-11-09"
description: "Learn how to create a plugin to manage UI in UE5."
image:
    url: ""
    alt: ""
tags: ["Unreal Engine", "C++", "Blueprints", "UI", "Plugin"]
---

## Intro

One of the most overlooked parts of game development is managing user interfaces as a project grows and becomes more complex. What starts as a simple main menu and in-game HUD can quickly turn into a tangled mess of screens, popups, and transitions. All of these also need to function correctly with various systems in the game, such as input modes, game states, and multiplayer contexts.

To solve this problem, I built a **UI Layers Manager Plugin** that was inspired by the [**Lyra Starter Game**](https://dev.epicgames.com/documentation/en-us/unreal-engine/lyra-sample-game-in-unreal-engine) template and [**this video**](https://youtu.be/_0aNOo2JVSI?si=3MrmohoQ37iJl5Ra) by [**AmrMakesGames**](https://www.youtube.com/@AmrMakesGames) on YouTube. The goal was to create a reusable framework that:

- Keeps all UI organized in named layers
- Decouples UI logic that can be used across projects
- Is usable in both C++ and Blueprints

In this tutorial, I’ll break down how the system works and how to integrate it into your own project.

## Understanding the Problem & System Design

### Why Use a UI Layer System?

Without a centralized system, UIs often get created and destroyed at various points in Blueprints or HUD classes. This makes it difficult to:

- Maintain consistent transitions
- Control input focus
- Manage overlapping menus (pause, inventory, settings)
- Scale across multiple gameplay contexts

### How Lyra Handles This

Lyra Starter Game introduced a “Common UI” system with **UI layers** such as:

- **Game Layer:** HUD, gameplay overlays
- **Menu Layer:** main menu, pause menu
- **Modal Layer:** dialogs, popups

Each layer handles its own widgets while the manager ensures only one layer has input focus at a time.

This plugin will follow a similar model, but with simplified C++ and Blueprint logic.

### Why Use a Subsystem?

Using a **Local Player Subsystem** gives each player their own instance of the UI Layers Manager, which is ideal for games that support split-screen or multiple local players. This ensures that UI layers are isolated for each player while still offering centralized control over UI operations.

- **Player-Specific Context:** Each local player gets their own subsystem instance, so UI state (menus, overlays, etc.) remains independent between players.
- **Automatic Lifetime Management:** The subsystem lives as long as the `ULocalPlayer` does, ensuring consistent behavior during level transitions or map loads.
- **Separation of Concerns:** The subsystem handles all layer registration, creation, and push/pop operations, keeping your `HUD` and `Widget` classes lightweight and focused only on display logic.
- **Access Anywhere:** Any Blueprint or C++ class with a player reference can retrieve it via `GetLocalPlayer()->GetSubsystem<UUILayersManagerSubsystem>()`, keeping the API simple and consistent.

## Plugin Setup and Folder Structure

First, create a new plugin using the [**Unreal Plugin Wizard**](https://dev.epicgames.com/documentation/en-us/unreal-engine/plugins-in-unreal-engine#creatingnewplugins). These are the settings I used:

![Creating a Blank plugin in UE5](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*meCnP7Xujg5miSmj2LkILQ.png)

Here’s what the folder structure should look like:

```bash
Plugins/
└── UILayersManager/
    ├── Content/
    ├── Resources/
    ├── Source/
    │   ├── UILayersManager/
    │   │   ├── Public/
    │   │   ├── Private/
    │   │   └── UILayersManager.Build.cs
    └── UILayersManager.uplugin
```

Add a new file called `UILayersManagerGameplayTags.ini`. I created a `Config/Tags/` directory for this file. This file will define the Gameplay Tags that will be used to name the individual UI layers:

```bash
[/Script/GameplayTags.GameplayTagsList]
GameplayTagList=(Tag="UI.Layer.Debug",DevComment="")
GameplayTagList=(Tag="UI.Layer.Game",DevComment="")
GameplayTagList=(Tag="UI.Layer.GameMenu",DevComment="")
GameplayTagList=(Tag="UI.Layer.Menu",DevComment="")
GameplayTagList=(Tag="UI.Layer.Modal",DevComment="")
```

Feel free to adjust this to fit the needs of your game.

Next, open `UILayersManager.Build.cs` and update the dependency modules by adding `"GameplayTags"` and `"UMG"` to the `PublicDepencyModulesNames` and `PrivateDependencyModulesNames` respectively:

```cs
PublicDependencyModuleNames.AddRange(
  new string[]
  {
    "Core",
    "GameplayTags",
  }
);
```

```cs
PrivateDependencyModuleNames.AddRange(
new string[]
  {
  "CoreUObject",
  "Engine",
  "Slate",
  "SlateCore",
  "UMG",
  }
);
```

In `UILayersManager.h`, add a new logging category for the module (this is totally optional but it can help with debugging if you run into issues as you are building out your game’s UI):

```cpp
DECLARE_LOG_CATEGORY_EXTERN(LogUILayersManager, Log, All);
```

`UILayersManager.h`:

```cpp
#pragma once

#include "Modules/ModuleManager.h"

DECLARE_LOG_CATEGORY_EXTERN(LogUILayersManager, Log, All);

class FUILayersManagerModule : public IModuleInterface
{
public:
  /** IModuleInterface implementation */
  virtual void StartupModule() override;
  virtual void ShutdownModule() override;
};
```

In `UILayersManager.cpp`, add the following includes and update `StartupModule()` to log that the module is starting up, add the plugin Gameplay Tags config path, and log the status of the subsystem. In `ShutdownModule()` we can simply log that the module is shutting down:

```cpp
#include "UILayersManager.h"
#include "Modules/ModuleManager.h"
#include "Logging/LogMacros.h"
#include "UILayersManagerSubsystem.h"
#include "GameplayTagsManager.h"
#include "Engine/GameInstance.h"
#include "Engine/Engine.h"

DEFINE_LOG_CATEGORY(LogUILayersManager);

#define LOCTEXT_NAMESPACE "FUILayersManagerModule"

void FUILayersManagerModule::StartupModule()
{
  UE_LOG(LogUILayersManager, Log, TEXT("UILayersManager module starting up..."));

  UGameplayTagsManager::Get().AddTagIniSearchPath(FPaths::ProjectPluginsDir() / TEXT("UILayersManager/Config/Tags"));

#if WITH_EDITOR
  UE_LOG(LogUILayersManager, Verbose, TEXT("Running in Editor mode."));
#endif

  if (GEngine && GEngine->GameViewport)
  {
    if (UGameInstance\* GI = GEngine->GameViewport->GetGameInstance())
    {
      if (GI->GetSubsystemBase(UUILayersManagerSubsystem::StaticClass()))
      {
        UE_LOG(LogUILayersManager, Log, TEXT("UILayersManagerSubsystem found and active."));
      }
      else
      {
        UE_LOG(LogUILayersManager, Warning, TEXT("UILayersManagerSubsystem not found on startup."));
      }
    }
  }
}

void FUILayersManagerModule::ShutdownModule()
{
  UE_LOG(LogUILayersManager, Log, TEXT("UILayersManager module shutting down..."));
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FUILayersManagerModule, UILayersManager)
```

**Note:** `UILayersManagerSubsystem` has not been created so the current code will not build. We will add this in a bit.

## Defining the UI Layer Class

Add a new class, `UILayer` of type `UUserWidget` to the plugin (`UILayer.h` goes in the `public` folder, `UILayer.cpp` goes in the `private` folder. This is the file structure we will use for the remainder of the tutorial):

```cpp
// UILayer.h

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "GameplayTagContainer.h"
#include "UILayerTypes.h"
#include "UILayer.generated.h"

UCLASS(Abstract)
class UILAYERSMANAGER*API UUILayer : public UUserWidget
{
  GENERATED_BODY()
public:
  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "UI Layer")
  FGameplayTag LayerTag;

  UUserWidget* PushContent(TSubclassOf<UUserWidget> WidgetClass);

  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  void PushContent(TSoftClassPtr<UUserWidget> WidgetClass, FOnWidgetLoaded Callback);

  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  void PopContent();

  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  void ClearStack();

  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  UUserWidget* Peek() const;

  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  void CollapseTop();

  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  void ShowTop();

  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  FText GetStackListNames() const;

  bool IsEmpty() const;

protected:
  UPROPERTY(EditAnywhere, BlueprintReadWrite, meta = (BindWidget))
  class UBorder* Border;

  UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "UI Layer")
  TArray<UUserWidget*> Stack;

  /** Blueprint implements the async loading process \*/
  UFUNCTION(BlueprintImplementableEvent, Category = "UI Layer")
  void RequestAsyncLoadWidget(const TSoftClassPtr<UUserWidget>& WidgetClass);

  /** Called when async load finishes */
  UFUNCTION(BlueprintCallable, Category = "UI Layer")
  void OnWidgetLoaded(UUserWidget\_ LoadedWidget);

private:
  FOnWidgetLoaded CallbackRef;
};

```

Let’s break down some of the properties and functions.

### Properties

- `FGameplayTag LayerTag`: Identifies this layer by a Gameplay Tag and makes it easier to reference layers without using hardcoded names.
- `UBorder* Border`: Acts as the root visual container for stacking widgets on this layer. When widgets are pushed/popped, they are added or removed from this border.
- `TArray<UUserWidget*> Stack`: Container that holds the widgets currently pushed to this layer.

### Functions

- `PushContent()`: Adds a new widget to the top of this layer. I’ve included two function overloads which will be used to async load widgets. You can choose which version you prefer.
    - The first declaration takes a `WidgetClass`reference, which will be used in conjunction with a `BlueprintAsyncActionBase`class. This will give us an async blueprint node with both an immediate out execution pin and an `OnCompleted` execution pin along with the spawned `Widget` reference.
    - The second declaration allows us to provide an optional callback function/event that fires once the widget has loaded.
- `PopContent()`: Removes the top widget from the stack. Can be used when closing menus or going back to a previous screen.
- `ClearStack()`: Removes all widgets from this layer.
- `Peek()`: Returns the top widget without removing it.
- `CollapseTop()`: Hides the current top widget in the stack (sets visibility to `Collapsed`).
- `ShowTop()`: Makes the top widget visible (sets visibility to `SelfHitTestInvisible`).
- `GetStackListNames()`: Returns a list of the stacked widget names as readable `FText` (useful for debugging or UI overlays that show the current stack).
- `IsEmpty()`: Returns true if the stack is empty, otherwise false if widgets are currently on the stack.
- `RequestAsyncLoadWidget()`: Function that is implemented in Blueprints to handle asynchronous loading of the widget. Used with the callback overload of `PopContent()`.
- `OnWidgetLoaded()`: Called when the async load is finished. Adds the loaded widget to the stack and updates visibility.

Here’s the implementation file:

```cpp
// UILayer.cpp

#include "UILayer.h"
#include "Components/Border.h"
#include "UILayersManager.h"

UUserWidget* UUILayer::PushContent(TSubclassOf<UUserWidget> WidgetClass)
{
  if (!WidgetClass)
  {
    return nullptr;
  }

  UUserWidget* CreatedWidget = CreateWidget<UUserWidget>(GetOwningPlayer(), WidgetClass);

  CollapseTop();
  Border->ClearChildren();

  Stack.Add(CreatedWidget);
  Border->AddChild(CreatedWidget);
  ShowTop();

  return CreatedWidget;
}

void UUILayer::PushContent(TSoftClassPtr<UUserWidget> WidgetClass, FOnWidgetLoaded Callback)
{
  CallbackRef = Callback;
  if (WidgetClass.IsNull())
  {
    UE_LOG(LogUILayersManager, Error, TEXT("PushContent: WidgetClass is null"));
    if (CallbackRef.IsBound())
    {
      CallbackRef.Execute(nullptr);
      CallbackRef.Clear();
    }
  return;
}

RequestAsyncLoadWidget(WidgetClass);
}
void UUILayer::PopContent()
{
  if (Stack.Num() == 0)
  {
    return;
  }

  if (UUserWidget* Top = Peek())
  {
    Top->RemoveFromParent();
    Stack.Pop();
    Border->ClearChildren();
  }

  if (UUserWidget* NewTop = Peek())
  {
    NewTop->SetVisibility(ESlateVisibility::SelfHitTestInvisible);
    Border->AddChild(NewTop);
  }
}

void UUILayer::ClearStack()
{
  for (UUserWidget* Widget : Stack)
  {
    if (Widget)
    {
      Widget->RemoveFromParent();
    }
  }

  Stack.Empty();
  Border->ClearChildren();
}

UUserWidget* UUILayer::Peek() const
{
  return Stack.IsEmpty() ? nullptr : Stack.Last();
}

void UUILayer::CollapseTop()
{
  if (UUserWidget* Widget = Peek())
  {
    Widget->SetVisibility(ESlateVisibility::Collapsed);
  }
}

void UUILayer::ShowTop()
{
  if (UUserWidget* Widget = Peek())
  {
    Widget->SetVisibility(ESlateVisibility::SelfHitTestInvisible);
  }
}

FText UUILayer::GetStackListNames() const
{
  TArray<FString> Names;
  for (UUserWidget* Widget : Stack)
  {
    Names.Push(Widget ? Widget->GetName() : TEXT("None"));
  }

  return FText::FromString(FString::Join(Names, TEXT("\n")));
}

bool UUILayer::IsEmpty() const
{
  return Stack.Num() == 0;
}

void UUILayer::OnWidgetLoaded(UUserWidget* LoadedWidget)
{
  if (!LoadedWidget)
  {
    return;
  }

  CollapseTop();
  Border->ClearChildren();

  Stack.Add(LoadedWidget);
  Border->AddChild(LoadedWidget);
  ShowTop();

  if (CallbackRef.IsBound())
  {
    CallbackRef.Execute(LoadedWidget);
    CallbackRef.Clear();
  }
}
```

## Defining the Layers Manager Subsystem

Create a new `ULocalPlayerSubsystem` class called `UUILayersManagerSubsystem`:

```cpp
// UILayersManagerSubsystem.h

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/LocalPlayerSubsystem.h"
#include "GameplayTagContainer.h"
#include "UILayerTypes.h"
#include "UILayersManagerSubsystem.generated.h"

class UUILayer;

UCLASS()
class UILAYERSMANAGER_API UUILayersManagerSubsystem : public ULocalPlayerSubsystem
{
  GENERATED_BODY()

public:
  /** Get subsystem from any WorldContextObject */
  static UUILayersManagerSubsystem* Get(const UObject* WorldContextObject);

  /** Create or retrieve a layer */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  UUILayer* CreateLayer(FGameplayTag LayerTag, TSubclassOf<UUILayer> LayerClass);

  /** Pushes a widget onto a specific layer */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  UUserWidget* PushToLayer(FGameplayTag LayerTag, TSubclassOf<UUserWidget> WidgetClass);

  /** Pushes a widget onto a specific layer. Includes an optional callback function pin to get a reference to the created widget */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  void PushToLayerWithCallback(FGameplayTag LayerTag, TSoftClassPtr<UUserWidget> WidgetClass, FOnWidgetLoaded Callback);

  /** Pops a widget from a specific layer if found */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  void PopFromLayer(FGameplayTag LayerTag);

  /** Clears all widgets in a specific layer if found */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  void ClearLayer(FGameplayTag LayerTag);

  /** Clears all widgets all found layers */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  void ClearAllLayers();

  /** Clears all widgets in all layers except the one specified */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  void ClearAllLayersExcept(FGameplayTag ExceptionLayerTag);

  /** Retrieve an existing layer */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  UUILayer* GetLayer(FGameplayTag LayerTag) const;

  /** Remove a layer */
  UFUNCTION(BlueprintCallable, Category = "UI Layers")
  void RemoveLayer(FGameplayTag LayerTag);

private:
  /** All active layers, keyed by tag */
  UPROPERTY(Transient)
  TMap<FGameplayTag, UUILayer*> ActiveLayers;
};
```

This class is the central layers manager. The included functions are the ones that will be directly called to push/pop widgets and manage layers. The `ActiveLayers` property is used to keep track of all the layers that have been created.

Here’s the implementation file:

```cpp
// UILayersManagerSubsystem.cpp

#include "UILayersManagerSubsystem.h"
#include "UILayer.h"
#include "Engine/World.h"
#include "UILayersManager.h"

UUILayersManagerSubsystem* UUILayersManagerSubsystem::Get(const UObject* WorldContextObject)
{
  if (!WorldContextObject)
  {
    return nullptr;
  }

  if (UWorld* World = WorldContextObject->GetWorld())
  {
    if (APlayerController* PC = World->GetFirstPlayerController())
    {
      if (ULocalPlayer* LP = PC->GetLocalPlayer())
      {
        return LP->GetSubsystem<UUILayersManagerSubsystem>();
      }
    }
  }

  return nullptr;
}

UUILayer* UUILayersManagerSubsystem::CreateLayer(FGameplayTag LayerTag, TSubclassOf<UUILayer> LayerClass)
{
  if (!LayerClass)
  {
    UE_LOG(LogUILayersManager, Warning, TEXT("CreateLayer: Invalid LayerClass for tag %s"), *LayerTag.ToString());
    return nullptr;
  }

  if (ActiveLayers.Contains(LayerTag))
  {
    UE_LOG(LogUILayersManager, Verbose, TEXT("Layer %s already exists"), *LayerTag.ToString());
    return ActiveLayers[LayerTag];
  }

  if (UWorld* World = GetWorld())
  {
    UUILayer* NewLayer = CreateWidget<UUILayer>(World, LayerClass);
    if (NewLayer)
    {
      NewLayer->LayerTag = LayerTag;
      NewLayer->AddToViewport();
      ActiveLayers.Add(LayerTag, NewLayer);
      UE_LOG(LogUILayersManager, Log, TEXT("Created layer %s"), *LayerTag.ToString());
      return NewLayer;
    }
  }

  UE_LOG(LogUILayersManager, Error, TEXT("Failed to create layer %s"), *LayerTag.ToString());
  return nullptr;
}

UUserWidget* UUILayersManagerSubsystem::PushToLayer(FGameplayTag LayerTag, TSubclassOf<UUserWidget> WidgetClass)
{
  UUILayer* Layer = GetLayer(LayerTag);
  if (!Layer)
  {
    UE_LOG(LogUILayersManager, Warning, TEXT("PushToLayer: Layer %s not found"), *LayerTag.ToString());
    return nullptr;
  }

  return Layer->PushContent(WidgetClass);
}

void UUILayersManagerSubsystem::PushToLayerWithCallback(FGameplayTag LayerTag, TSoftClassPtr<UUserWidget> WidgetClass, FOnWidgetLoaded Callback)
{
  UUILayer* Layer = GetLayer(LayerTag);
  if (!Layer)
  {
    UE_LOG(LogUILayersManager, Warning, TEXT("PushToLayerWithCallback: Layer %s not found"), *LayerTag.ToString());
    return;
  }

  Layer->PushContent(WidgetClass, Callback);
}

void UUILayersManagerSubsystem::PopFromLayer(FGameplayTag LayerTag)
{
  UUILayer* Layer = GetLayer(LayerTag);
  if (!Layer)
  {
    UE_LOG(LogUILayersManager, Warning, TEXT("PopFromLayer: Layer %s not found"), *LayerTag.ToString());
    return;
  }

  Layer->PopContent();
}

void UUILayersManagerSubsystem::ClearLayer(FGameplayTag LayerTag)
{
  UUILayer* Layer = GetLayer(LayerTag);
  if (!Layer)
  {
    UE_LOG(LogUILayersManager, Warning, TEXT("ClearLayer: Layer %s not found"), *LayerTag.ToString());
    return;
  }

  Layer->ClearStack();
}

void UUILayersManagerSubsystem::ClearAllLayers()
{
  for (auto& Pair : ActiveLayers)
  {
    UUILayer* Layer = Pair.Value;

    if (!Layer)
    {
      continue;
    }

    Layer->ClearStack();
  }
}

void UUILayersManagerSubsystem::ClearAllLayersExcept(FGameplayTag ExceptionLayerTag)
{
  for (auto& Pair : ActiveLayers)
  {
    UUILayer* Layer = Pair.Value;

    if (!Layer || Layer->LayerTag == ExceptionLayerTag)
    {
      continue;
    }

    Layer->ClearStack();
  }
}

UUILayer* UUILayersManagerSubsystem::GetLayer(FGameplayTag LayerTag) const
{
  if (UUILayer* const* Found = ActiveLayers.Find(LayerTag))
  {
    return *Found;
  }

  return nullptr;
}

void UUILayersManagerSubsystem::RemoveLayer(FGameplayTag LayerTag)
{
  if (UUILayer* Layer = GetLayer(LayerTag))
  {
    Layer->RemoveFromParent();
    ActiveLayers.Remove(LayerTag);
    UE_LOG(LogUILayersManager, Log, TEXT("Removed layer %s"), *LayerTag.ToString());
  }
}
```

## Defining the HUD class

Create a new `AHUD` class named `UIHUD`, which will be used to initialize the UI Layout.

```cpp
// UIHUD.h

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "GameplayTagContainer.h"
#include "UIHUD.generated.h"

class UUILayer;

UCLASS(Abstract)
class AUIHUD : public AHUD
{
  GENERATED_BODY()

protected:
  /** Define layers */
  UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "UI")
  TMap<FGameplayTag, TSubclassOf<UUILayer>> LayerDefinitions;

  /** Define optional default widgets */
  UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "UI")
  TMap<FGameplayTag, TSoftClassPtr<UUserWidget>> InitialWidgets;

  virtual void BeginPlay() override;

private:
  void InitializeLayout();
};
```

### Properties

- `LayerDefinitions`: Set in a child Blueprint class and stores a map of the specific layers that are needed for project’s UI.
- `InitialWidgets`: Another property to be set in Blueprints that can be used to optionally add some widgets to the layers by default.

Here’s the implementation file:

```cpp
#include "UIHUD.h"
#include "UILayersManagerSubsystem.h"
#include "UILayer.h"
#include "UILayersManager.h"

void AUIHUD::BeginPlay()
{
  Super::BeginPlay();

  InitializeLayout();
}

void AUIHUD::InitializeLayout()
{
  APlayerController* PC = GetOwningPlayerController();
  if (!PC)
  {
    UE_LOG(LogUILayersManager, Warning, TEXT("InitializeLayout: PlayerController not found"));
    return;
  }

  ULocalPlayer* LP = PC->GetLocalPlayer();
  if (!LP)
  {
    UE_LOG(LogUILayersManager, Warning, TEXT("InitializeLayout: Local Player not found"));
    return;
  }

  UUILayersManagerSubsystem* Subsystem = LP->GetSubsystem<UUILayersManagerSubsystem>();
  if (!Subsystem)
  {
    return;
  }

  // Create layers
  for (auto& Pair : LayerDefinitions)
  {
    if (!Pair.Value)
    {
      continue;
    }

    Subsystem->CreateLayer(Pair.Key, Pair.Value);
  }

  // Push default widgets
  for (auto& Pair : InitialWidgets)
  {
    if (!Pair.Value.IsNull())
    {
      Subsystem->PushToLayerWithCallback(Pair.Key, Pair.Value, FOnWidgetLoaded());
    }
  }

  UE_LOG(LogUILayersManager, Log, TEXT("Initialized %d layers with default widgets"), LayerDefinitions.Num());
}
```

## Defining the Blueprint Async Action class

This class is totally optional and will tie into the `PushToLayer()` function that returns a `UserWidget` in the subsystem. I really wanted an async blueprint node so that I could avoid having to manually define a callback function when I need a reference to the loaded widget:

![PushToLayerAsync Blueprint node](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*2km7JbJuhQ_4tDzMN6Zr-A.png)

Using the other method would require the following setup to achieve the same result:

![PushToLayerWithCallback Blueprint node tied to optional callback event](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BOZJUELBCFz4DdsOAj8X9A.png)

Either method is totally fine, and I decided to keep both in this plugin so that I can use `PushToLayerAsync` in Blueprints and `PushToLayerWithCallback` in C++.

To setup `PushToLayerAsync`, add a `BlueprintAsyncActionBase` class named `AsyncLoadWidget`:

```cpp
// AsyncLoadWidget.h

#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintAsyncActionBase.h"
#include "GameplayTagContainer.h"
#include "AsyncLoadWidget.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FLoadCompleted, UUserWidget*, LoadedWidget);

UCLASS()
class UILAYERSMANAGER_API UAsyncLoadWidget : public UBlueprintAsyncActionBase
{
  GENERATED_BODY()
public:
  UPROPERTY(BlueprintAssignable)
  FLoadCompleted OnCompleted;

  // Factory function
  UFUNCTION(BlueprintCallable, meta = (BlueprintInternalUseOnly = "true", WorldContext = "WorldContextObject", Category="UI Layers|Async"))
  static UAsyncLoadWidget* PushToLayerAsync(APlayerController* OwningPlayer, UObject* WorldContextObject, FGameplayTag LayerTag, TSoftClassPtr<UUserWidget> WidgetClass);

  virtual void Activate() override;
private:
  APlayerController* OwningPlayer;
  UObject* WorldContextObject;
  FGameplayTag LayerTag;
  TSoftClassPtr<UUserWidget> WidgetClassRef;

  void OnWidgetClassReady(UClass* WidgetClass);
  void OnWidgetClassLoaded();
};
```

Here’s the implementation file:

```cpp
#include "AsyncLoadWidget.h"
#include "Blueprint/UserWidget.h"
#include "Engine/StreamableManager.h"
#include "Engine/AssetManager.h"
#include "UILayersManagerSubsystem.h"

UAsyncLoadWidget* UAsyncLoadWidget::PushToLayerAsync(APlayerController* OwningPlayer, UObject* WorldContextObject, FGameplayTag LayerTag, TSoftClassPtr<UUserWidget> WidgetClass)
{
  UAsyncLoadWidget* AsyncTask = NewObject<UAsyncLoadWidget>();
  AsyncTask->OwningPlayer = OwningPlayer;
  AsyncTask->WorldContextObject = WorldContextObject;
  AsyncTask->LayerTag = LayerTag;
  AsyncTask->WidgetClassRef = WidgetClass;

  return AsyncTask;
}

void UAsyncLoadWidget::Activate()
{
  Super::Activate();

  if (!WorldContextObject || !WidgetClassRef.IsValid())
  {
    OnCompleted.Broadcast(nullptr);
    return;
  }

  UWorld* World = GEngine->GetWorldFromContextObjectChecked(WorldContextObject);
  if (!World)
  {
    OnCompleted.Broadcast(nullptr);
    return;
  }

  // If already loaded, skip async path
  if (UClass* WidgetClass = WidgetClassRef.Get())
  {
    OnWidgetClassReady(WidgetClass);
    return;
  }

  // Async load
  FStreamableManager& StreamableManager = UAssetManager::GetStreamableManager();
  StreamableManager.RequestAsyncLoad(
    WidgetClassRef.ToSoftObjectPath(),
    FStreamableDelegate::CreateUObject(this, &UAsyncLoadWidget::OnWidgetClassLoaded)
  );
}

void UAsyncLoadWidget::OnWidgetClassReady(UClass* WidgetClass)
{
  if (!OwningPlayer || !WidgetClass)
  {
    OnCompleted.Broadcast(nullptr);
    return;
  }

  UWorld* World = GEngine->GetWorldFromContextObjectChecked(WorldContextObject);
  if (!World)
  {
    OnCompleted.Broadcast(nullptr);
    return;
  }

  if (ULocalPlayer* LocalPlayer = OwningPlayer->GetLocalPlayer())
  {
    if (UUILayersManagerSubsystem* Subsystem = LocalPlayer->GetSubsystem<UUILayersManagerSubsystem>())
    {
      UUserWidget* Widget = Subsystem->PushToLayer(LayerTag, WidgetClass);
      OnCompleted.Broadcast(Widget);
      return;
    }
  }

  // Fallback if subsystem is missing
  UUserWidget* Widget = CreateWidget<UUserWidget>(World, WidgetClass);
  OnCompleted.Broadcast(Widget);
}

void UAsyncLoadWidget::OnWidgetClassLoaded()
{
  UWorld* World = GEngine->GetWorldFromContextObjectChecked(WorldContextObject);
  if (!World)
  {
    OnCompleted.Broadcast(nullptr);
    return;
  }

  if (UClass* WidgetClass = WidgetClassRef.Get())
  {
    UUserWidget* Widget = CreateWidget<UUserWidget>(World, WidgetClass);
    OnCompleted.Broadcast(Widget);
  }
  else
  {
    OnCompleted.Broadcast(nullptr);
  }
}
```

## Editor Setup

At this point, build the project and open up the editor. We will need to add child Blueprint classes for the `UILayer` and `UIHUD` classes.

### `WBP_UILayer`

Create a new Blueprint class, `WBP_UILayer` derived from `UILayer` in the UILayersManager Content folder.

In the Designer add the Border component that will be used to push widgets onto:

![WBP_UILayer Border component](https://miro.medium.com/v2/resize:fit:322/format:webp/1*Fh5lE1pqjTJ2MORvAC17vg.png)

Here are the style settings I used:

![Border component style settings](https://miro.medium.com/v2/resize:fit:1258/format:webp/1*YarUSlmqxqI7rQ205DPeDw.png)

**Important:** make sure to set the Border’s **Visibility** as **Not Hit-Testable (Self Only)**, otherwise click events will be blocked:

![Border component marked as Not Hit-Testable (Self Only)](https://miro.medium.com/v2/resize:fit:1246/format:webp/1*MeMVZvcqdBCZTKp9zJUp2A.png)

In the Event Graph, override `RequestAsyncLoadWidget` to handle the actual loading of pushed widgets (only required if using `PushToLayerWithCallback`):

![RequestAsyncLoadWidget override event](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*kUIGTjlIKHaK1-xMF09Kow.png)

And that’s the complete setup for the plugin. To use this logic in a game, just add a new `UIHUD`-derived Blueprint class and set the `LayerDefinitions` and `InitialWidgets` properties. Adjust these as needed for your specific game:

![Example Layer Definitions in the Blueprint HUD class](https://miro.medium.com/v2/resize:fit:992/format:webp/1*wFv1fn5KlCsJMGH198vPYg.png)!

[Example Initial Widgets property set in the Blueprint HUD class](https://miro.medium.com/v2/resize:fit:974/format:webp/1*ngg_FdW_nijLjITH1UkWdQ.png)

In the above screenshots, I added four layers: **Game**, **GameMenu**, **Menu**, and **Modal** (selected from the Gameplay Tags we defined earlier). I also added an initial screen to the Game layer (the main gameplay HUD) so that it is automatically created when the game is played.

Now just set the HUD class in either the level **World Settings** or your **Game Mode** class and the UI Layers and any initial widgets should be added to the viewport (I’m using the FPS Shooter template included with engine version 5.6):

![Example shooter HUD pushed to the Game UI layer](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*TWDoLcNm-dsCNhCVNkIrQQ.png)

## **Example Usage: Pause Menu Toggle**

Now that the **UI Layers Manager** is setup, Let’s go over a simple example to demonstrate the basic functionality. We will be creating a Pause Menu that will be pushed to the **Menu** layer and will also handle input modes and pausing/unpausing the game.

### Creating a Pause Menu

Create a new UserWidget Blueprint class call **WBP_PauseMenu** and setup the hierarchy as needed for your game. Here is a basic setup:

![Pause Menu widget hierarchy](https://miro.medium.com/v2/resize:fit:770/format:webp/1*8gzJZ_ZXvM--1KYOoFQKFw.png)

![Border component design settings](https://miro.medium.com/v2/resize:fit:1310/format:webp/1*U-9zh0sOUJhf8eX7o_8UEA.png)

![Vertical Box component design settings](https://miro.medium.com/v2/resize:fit:1322/format:webp/1*ceGnaI44RNJL8HfPto7Drg.png)

![Paused text component design settings](https://miro.medium.com/v2/resize:fit:1318/format:webp/1*OhGbDxmUZjgGJ8X2np15Gw.png)

![First Spacer component design settings](https://miro.medium.com/v2/resize:fit:1334/format:webp/1*92gY_p-Zcx43FCD5TwQS6w.png)

![Resume button text component design settings](https://miro.medium.com/v2/resize:fit:1324/format:webp/1*wplEW7Vu47sK-__7yN_Isg.png)

![Second Spacer component design settings](https://miro.medium.com/v2/resize:fit:1324/format:webp/1*IKbNgoSveJUO085Ii8vPiA.png)

![Quit button text component design settings](https://miro.medium.com/v2/resize:fit:1330/format:webp/1*T_6oDyg4bcunRP-JA9TXTg.png)

![WBP_PauseMenu design](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zk1q5J7bWCFk0CvnBf-0mQ.png)

Make sure to select the root component and set the Desired Focus Widget as the Resume Button:

![Pause Menu root component](https://miro.medium.com/v2/resize:fit:564/format:webp/1*nTrAS3Ud8wcu3WxJ67VyOg.png)

![Setting the Resume Button as the desired focus widget](https://miro.medium.com/v2/resize:fit:826/format:webp/1*zhuMAIoZU3xw7cyvWlD6Lg.png)

In the Event Graph, override **EventConstruct** and call **SetKeyboardFocus** to ensure that the Resume Button is focused on when the menu is opened:

![Setting Keyboard Focus in Event Construct](https://miro.medium.com/v2/resize:fit:796/format:webp/1*WVzA0IoQfqy6YwQnZcDm2A.png)

Add an **Event Dispatcher** called **OnRequestCloseMenu**:

![OnRequestCloseMenu event dispatcher](https://miro.medium.com/v2/resize:fit:330/format:webp/1*oT4JtXhfXt1jJzQAl9LpVQ.png)

Call it from the Resume Button **OnClicked** event:

![Resume Button on clicked event](https://miro.medium.com/v2/resize:fit:1022/format:webp/1*8VL5c5alyLIrekfHS7qdcA.png)

Add **OnClicked** handling for the Quit Button if desired:

![Quit Button on clicked event](https://miro.medium.com/v2/resize:fit:1066/format:webp/1*e9pzJXieqL0sOcO3aPxKYw.png)

### Blueprint HUD Class setup

In the Blueprint GameHUD class, add a new event dispatcher called **OnPauseMenuToggled**:

![OnPauseMenuToggled event dispatcher](https://miro.medium.com/v2/resize:fit:320/format:webp/1*16MILVbXonBrOgt0jJfMYw.png)

Include the following inputs:

![OnPauseMenuToggled event dispatcher inputs](https://miro.medium.com/v2/resize:fit:942/format:webp/1*mmbpWvieWY_pvYTwhU6KZQ.png)

Next, add a new event called **ToggleMenu**:

![ToggleMenu event in BP_GameHUD part 1](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*nPvrsm1I802DXulMjKjWIA.png)

![ToggleMenu event in BP_GameHUD part 2](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*TUa_6CYhaMHGFkx1lQEXZw.png)

Add an event to handle close requests from the pause menu widget:

![OnRequestClosePauseMenu event](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*TIycW_eFYxBd-Nfoxvs-ow.png)

### Player Controller Class Setup

Next, open up the player controller class for your game and add a new `protected` function called `HandleMenuToggled`:

```cpp
// .h file

UFUNCTION(BlueprintCallable)
void HandleMenuToggled(bool bIsMenuOpen, UUserWidget* WidgetToFocus);
```

```cpp
// .cpp file

void AUITutorialsPlayerController::HandleMenuToggled(bool bIsMenuOpen, UUserWidget* WidgetToFocus)
{
  if (bIsMenuOpen)
  {
    SetPause(true);

    FInputModeGameAndUI InputMode;
    if (WidgetToFocus)
    {
      InputMode.SetWidgetToFocus(WidgetToFocus->TakeWidget());
    }
    InputMode.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);
    SetInputMode(InputMode);

    bShowMouseCursor = true;
  }
  else
  {
    SetPause(false);

    FInputModeGameOnly InputMode;
    SetInputMode(InputMode);

    bShowMouseCursor = false;
    SetIgnoreLookInput(false);
    SetIgnoreMoveInput(false);
  }
}
```

This function will allow us to handle game pause and input states depending on whether the menu is open or closed.

**Note:** I did test this same logic in Blueprints but the behavior wasn’t consistent with the C++ logic above. I’ll include a screenshot in case anyone wants to try out that setup instead:

![Blueprint event version of HandleMenuToggled](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*--g-vqmB53AoViD--jEeDw.png)

It’s almost the same behavior, except the mouse cursor isn’t recaptured when the menu is closed.

In the blueprint class derived from this C++ class (or the same Blueprint class you’re already working in if you added the logic above in Blueprints), setup a binding for the HUD **OnPauseMenuToggled** event. This will be connected to the **HandleMenuToggled** logic we just created:

![HandleMenuToggled binding](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*qnPACxcU4zENu7HRDALRZQ.png)

And finally setup an input event to allow pausing and unpausing the game:

![Toggle pause menu event tied to the escape key](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vnOyevGbBhzVlL5Hi2EWVg.png)

Now we are able to pause the game and display the menu we created:

![In-game pause menu displayed using plugin logic](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xCSY_qQADkrwvoq3mq-1MQ.png)

Right now the underlying Game HUD is still shown, so an optional improvement to this logic would be to setup handling in the subsystem to hide other layers when pushing a new widget.

## Conclusion

The **UI Layers Manager Plugin** provides a structured and scalable approach to building layered UI systems in Unreal Engine.

By using a **Local Player Subsystem**, we can offload the layer managing to the subsystem. Each layer maintains its own stack of widgets, allowing for flexible UI flows like menus, modals, and in-game overlays without mixing up widget references.

With this foundation you can:

- Add new UI layers dynamically
- Load widget asynchronously, avoiding hard references
- Push and pop screens in a stack-like fashion
- Manage player UI state from C++ or Blueprint

This modular system offers both designers and programmers a clean and powerful interface for building complex UIs that scale with your game.
