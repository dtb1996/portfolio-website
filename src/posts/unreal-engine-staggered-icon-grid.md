---
title: "Creating a Staggered Icon Grid Background in Unreal Engine"
date: "2026-04-17"
description: "Learn how to create a staggered icon UI material in UE5."
image:
    url: ""
    alt: ""
tags: ["Unreal Engine", "C++", "Blueprints", "UI"]
---

## Intro

In video games, UI backgrounds are often overlooked, but a well-designed one can add a little bit of style and visual consistency to a game menu. In this post, I’ll walk through how I created a reusable, staggered grid material in Unreal Engine that can tile an icon across your UI.

Here’s the final result:

![Staggered Icon Grid](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*udLftuTfv7fyDnZhS3rvjA.gif)

## Why use a material for this?

Unlike a line-based grid, this material lets you repeat an icon texture across a panel, with every other row horizontally offset (like the stars on the US flag). This adds visual interest while keeping the background flexible.

Key benefits:

- Fully procedural
- Resolution independent
- Easily customizable with material parameters
- Lightweight

## Material Parameters

These are the parameters exposed in the material that can be overridden in Material Instances:

- **Icon Texture**: the texture or symbol to repeat
- **Icon Color**: tint color for the repeated icons
- **Background Color**: color for the empty space behind icons
- **Aspect Ratio**: the screen/panel aspect ratio, used to automatically adjust the grid tiles to remain uniform
- **Icon Scale**: size of each icon relative to its tile cell (1.0 = fill entire cell)
- **Tile Density**: icon density
- **Panning Speed X/Y**: optional panning animation values

## Core Material Concept

The material works by UV manipulation:

1. Apply panning specified by **Panning Speed X/Y**
2. Scale UVs using **Tile Density**
3. Scale UVs using **Aspect Ratio** to account for non-square screens/panels
4. Offset every other row horizontally for the stagger
5. Sample the **Icon Texture** at the modified UVs
6. Apply **Icon Scale** and **Icon Color**
7. Blend with **Background Color**

This produces a uniform, staggered pattern.

## Material Setup

### Set the Material Domain and Blend Mode

First, to setup the material for our use case, click on the Result node and update the `Material Domain` to be `User Interface` and the `Blend Mode` to be `Translucent`:

![Material result node](https://miro.medium.com/v2/resize:fit:404/format:webp/1*AJjRrwZ-21qmylz7Dk0eyw.png)

![Material Domain and Blend Mode settings](https://miro.medium.com/v2/resize:fit:986/format:webp/1*bL_kdTKGgTV8emd5dVFCgA.png)

### Get the UV Texture Coordinates and apply the panning

Add a `TexCoord` node and plug the output into a `Panner` node. The `PanningSpeedX` and `PanningSpeedY` values will be combined and used as the `Panner` speed input:

![Getting the UV Texture Coordinates and applying panning](https://miro.medium.com/v2/resize:fit:1108/format:webp/1*qdzJR0wqd4O7OXa3zjbL6A.png)

Be sure to set the `UTiling` and `VTiling`to `0.25` for the `TexCoord` node in the details panel:

![UTiling and VTiling settings](https://miro.medium.com/v2/resize:fit:1006/format:webp/1*ImeRaSVjmm4BxXSmG5_x5w.png)

For the `PanningSpeedX` and `PanningSpeedY`, I set the default value at `0.005`:

![Panning speed nodes](https://miro.medium.com/v2/resize:fit:426/format:webp/1*nPfPY-CDW7w5nB431Q0RJw.png)

**Note**: you can quickly add a new Scalar Parameter by holding down the S key and left-clicking in the Material Graph:

![Adding a scalar parameter](https://miro.medium.com/v2/resize:fit:434/format:webp/1*9ih2YdiDNBeBH6COLOy7uQ.png)

### Apply the Tile Density

Take the output of the `Panner` node and multiply this by the `TileDensity`:

![Getting the BaseUV from the Panner output and the Tile Density parameter](https://miro.medium.com/v2/resize:fit:1018/format:webp/1*2-xNk0c5xpdZf0SSjLusFA.png)

I have not experimented with the tile density parameter to see how the value correlates to how many icons are actually on the screen at any given time, but I found that a default value of `18` works for my game when using an icon with the dimensions of `512x512` pixels.

### Separate the U and V (X and Y), then apply the Aspect Ratio and Offset

Now it’s time to manipulate the `U` and `V` channels separately to produce the staggered grid. Mask out the output from the `BaseUV` `Multiply` node:

![Masking out the U and V channels from the BaseUV](https://miro.medium.com/v2/resize:fit:578/format:webp/1*Pf2PLaQME_PO1RdUNAzyMA.png)

The `Mask` node can be found by searching for `Component Mask`:

![Searching for the Component Mask node](https://miro.medium.com/v2/resize:fit:280/format:webp/1*GFl89m9DSzK93LxR2qrrkw.png)

Or by using the keyboard shortcut Shift+C:

![Component Mask node](https://miro.medium.com/v2/resize:fit:292/format:webp/1*DEV43lIVem9PlaeoexDamA.png)

You can select which channels should pass through (are not masked out) by clicking the dropdown on the node or by selecting the node and adjusting in the Details panel:

![Selecting mask channels directly on the node](https://miro.medium.com/v2/resize:fit:270/format:webp/1*U6bTE3bWFlILONA9QwO5gA.png)

![Selecting component mask channels in the Details panel](https://miro.medium.com/v2/resize:fit:1014/format:webp/1*wMIovug0bncUxoz6CJTIMQ.png)

To get the `U` or `X` channel, select `R`. For the `V` or `Y` channel, select `G`:

![Separating out the U/X and V/Y channels using component masks](https://miro.medium.com/v2/resize:fit:576/format:webp/1*MEBrZVISdqgtW9MP-rpOjQ.png)

For the `U` channel, simply multiply by the `AspectRatio` parameter:

![Multiplying the U/X channel by the Aspect Ratio to prevent icon distortion](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_GIA0b0o8-X8ePGYD7o4hQ.png)

The aspect ratio `16/9` works out to be about `1.78`, which is what I set as the default value for `AspectRatio`. Later on I’ll show how I set this at runtime using a Dynamic Material Instance, and adding handling to adjust to window size changes.

The `V` channel is used to apply the horizontal offset by shifting the icons on every other row:

![Applying horizontal offset to every other row](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*d0wL1m0jCpXpoEQotrytBg.png)

**Note**: `Constant` value nodes can be added holding down keyboard key 1 and left clicking in the graph:

![Material Constant node](https://miro.medium.com/v2/resize:fit:326/format:webp/1*RjL6d29-t58Hvau7703x8w.png)

The keys 2, 3, and 4 for can be used for `Constant2`, `Constant3`, and `Constant4` respectively:

![Constant node variations](https://miro.medium.com/v2/resize:fit:1088/format:webp/1*5KkzBdn-IiIRQlVVf14cqw.png)

Adding all of this together will give the `OffsetX`:

![Adding the channels back together to get the OffsetX result](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*g1YlbZ9DEU3ROOY3MRfKHA.png)

Finally, plugging this result into a `Frac` node and appending the V channel into a Frac node will give the `LocalUV`:

![Getting the LocalUV](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Hxiarn6lqdKHCO5DYIMRTQ.png)

You can see what the logic so far is doing by right-clicking the `Append` node and selecting `Start Previewing Node`:

![Previewing the LocalUV](https://miro.medium.com/v2/resize:fit:462/format:webp/1*VGUll1SWNKM33NrgmtKZuA.png)

Over in the Preview window you can see the panning tiles:

![LocalUV preview](https://miro.medium.com/v2/resize:fit:1008/format:webp/1*SKUiOjKP1sz5gDLeYI9Nwg.png)

### Centering the tiles, applying scale, and setting up the icon mask

Take the output from the previous step and plug into a `Subtract` node with a `B` value of `0.5`:

![Calculating the CenteredUV](https://miro.medium.com/v2/resize:fit:744/format:webp/1*oYbK3Iq1LS2IPQWbJjds3A.png)

This will center the icon within its tile, otherwise it would appear cutoff.

To generate the `IconMask`, first get the `ScaledUV` by dividing by `IconScale`, then `Adding` `0.5`, plugging into the `IconTexture` parameter `UV` input, and plugging the `Alpha` output into a `Multiply` node:

![Generating the Icon Mask](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iXWzx8gie-ecPU8BIU0fsg.png)

Out of the same `CenteredUV` `Subtract` node, mask out the `X` and `Y` and multiply the generated `Mask.X` and `Mask.Y` values:

![Calculating the Mask X and Y](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*w-N3YohtQ4Js27JsGuDGdA.png)

Plug the result into the `IconMask` `Multipy` node from before. The whole block from this step should look something like this:

![CenteredUV to IconMask logic](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mn7v2VSB-2eexPjCpeXQHQ.png)

Previewing the `IconMask` node at this point shows that the material is almost complete:

![Icon Mask preview](https://miro.medium.com/v2/resize:fit:998/format:webp/1*gi1OXX_SwEa2ewU7iutPyA.png)

### Apply the Background and Icon colors

Add two `Vector4` parameters by either right-clicking and searching for `Vector Parameter` or by adding a `Constant4` node (keyboard 4 + left click) then right-clicking it and selecting `Convert to Parameter`:

![Converting a Constant4 to a parameter](https://miro.medium.com/v2/resize:fit:596/format:webp/1*VJqRHquR5xiJjYkcytXRfw.png)

I called the parameters `BackgroundColor` (defaulted to black: `0.0, 0.0, 0.0, 1.0`) and `IconColor` (defaulted to white with an alpha of 60%: `1.0, 1.0, 1.0, 0.6`):

![BackgroundColor and IconColor parameter nodes](https://miro.medium.com/v2/resize:fit:776/format:webp/1*oodMVGRtHu1UL4NEWNugqA.png)

To add the `BackgroundColor` and overlay the colored icons on top, add a `Lerp` node and plug in the `BackgroundColor` (using a `Multiply` node to apply the alpha) into `A` and the `IconColor` into `B`:

![Background color/alpha and Icon color Lerp inputs](https://miro.medium.com/v2/resize:fit:1060/format:webp/1*0x5mG2C9yxOeEogh29jbHQ.png)

The IconColor alpha will be multiplied by the IconMask from before to specify the Lerp Alpha:

![Getting the Lerp alpha from the IconMask and IconColor opacity](https://miro.medium.com/v2/resize:fit:1230/format:webp/1*WjNSplMf6tUFSMrZfdEOYA.png)

And finally plug the `Lerp` output into the `Final Color` input of the material result node:

![Plugging the Lerp output into the material result node](https://miro.medium.com/v2/resize:fit:776/format:webp/1*EiQjM9yqD_0oKVzoRTGtRQ.png)

This is what the whole block from this section should look like:

![Final material flow from Lerp into result node](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Bl41xeC8DJHHXBdgZzm--w.png)

Looking at the Preview window, we see the panning white icons over the black background as expected:

![Final material result preview](https://miro.medium.com/v2/resize:fit:996/format:webp/1*1sfQP6_e8qdB-byGI1U5dQ.png)

And just to show that the background color works as expected, here’s the preview with a blue background color:

![Changing the Background Color parameter](https://miro.medium.com/v2/resize:fit:382/format:webp/1*FK9kv2Yx39ANoRYC44AXBw.png)

![Result with blue blackground color](https://miro.medium.com/v2/resize:fit:990/format:webp/1*bKTaVxb4DqPappHEN4xJZA.png)

## Creating a Material Instance

To create a Material Instance from this material, right-click the material in the `Content Browser` and select `Create Material Instance`:

![Creating a Material Instance in the Content Browser](https://miro.medium.com/v2/resize:fit:736/format:webp/1*YQ2MwxLyZczB1h0KUV7raQ.png)

In the new Material Instance, all of the defined parameters can be easily updated:

![Material Instance parameters inherited from the parent Material](https://miro.medium.com/v2/resize:fit:1028/format:webp/1*1JtzjeFP-xCPu5Ptb4zoaw.png)

## Creating a Menu Background Widget

Create a new `UserWidget` Blueprint class, and add an image component to the Hierarchy:

![Creating a User Widget Blueprint class](https://miro.medium.com/v2/resize:fit:1276/format:webp/1*aLPPElmiVW0jtBbPCOUq5g.png)

![Adding an Image component to the widget](https://miro.medium.com/v2/resize:fit:564/format:webp/1*DO5k8rMAaLpjaRnJM12xbw.png)

In the details, I set the component to be a variable since I am going to use a Dynamic Material Instance to be able to set parameters at runtime. I also assigned the material instance created in the previous step to the `Brush` `Image` property:

![Background image component details](https://miro.medium.com/v2/resize:fit:1322/format:webp/1*MQgLLC_8nxZl_X8NuJDjJQ.png)

Here’s the result:

![Result of applying the material instance to the background image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*XK5OKKldJLPifYkepmwqHA.png)

This can also be used to fill partial areas of the screen or fill specific containers. Just remember that the `AspectRatio` parameter needs to be updated accordingly. If you’d like to add child components within the container that the grid is applied to, I would use a `Border` instead of an `Image` component.

## Using a Dynamic Material to set the Aspect Ratio

I am using this widget to cover the entire screen in the backgrounds of my menus. To handle window resizes and differing monitor aspect ratios, I decided to create a parent `UserWidget` C++ class to keep track of the Viewport sizing:

```cpp
// TiledIconBackground.h

#pragma once
#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "TiledIconBackground.generated.h"

UCLASS(Abstract)
class YOURPROJECT_API UTiledIconBackground : public UUserWidget
{
  GENERATED_BODY()

public:
  virtual void NativeConstruct() override;

  virtual void NativeDestruct() override;

protected:
  UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "UI")
  UMaterialInterface* BaseMaterial;

  UPROPERTY(Transient, BlueprintReadOnly, Category = "UI")
  UMaterialInstanceDynamic* DynamicMaterial;

  UPROPERTY(meta = (BindWidget))
  class UImage* BackgroundImage;

private:
  void OnViewportResized(FViewport* Viewport, uint32 Val);

  void UpdateAspectRatio();
};
```

```cpp
// TiledIconBackground.cpp

#include "TiledIconBackground.h"
#include "Components/Image.h"

void UTiledIconBackground::NativeConstruct()
{
  Super::NativeConstruct();

  if (BaseMaterial && BackgroundImage)
  {
    DynamicMaterial = UMaterialInstanceDynamic::Create(BaseMaterial, this);
    BackgroundImage->SetBrushFromMaterial(DynamicMaterial);
  }

  if (GEngine && GEngine->GameViewport)
  {
    GEngine->GameViewport->Viewport->ViewportResizedEvent.AddUObject(this, &UTiledIconBackground::OnViewportResized);
  }

  UpdateAspectRatio();
}

void UTiledIconBackground::NativeDestruct()
{
  if (GEngine && GEngine->GameViewport)
  {
    GEngine->GameViewport->Viewport->ViewportResizedEvent.RemoveAll(this);
  }

  Super::NativeDestruct();
}

void UTiledIconBackground::OnViewportResized(FViewport\* Viewport, uint32 Val)
{
  UpdateAspectRatio();
}

void UTiledIconBackground::UpdateAspectRatio()
{
  if (!DynamicMaterial || !GEngine || !GEngine->GameViewport)
  {
    return;
  }

  FVector2D ViewportSize;
  GEngine->GameViewport->GetViewportSize(ViewportSize);

  if (ViewportSize.Y > 0)
  {
    float AspectRatio = ViewportSize.X / ViewportSize.Y;
    DynamicMaterial->SetScalarParameterValue(TEXT("AspectRatio"), AspectRatio);
  }
}
```

`UMaterialInterface* BaseMaterial` will be set in the editor and will point to the staggered icon material or material instance created earlier.

`UMaterialInstanceDynamic* DynamicMaterial` is the actual dynamic material instance that will be created at runtime. I have marked it as `Transient` to ensure it is reset or null initially when playing the game.

Since I am using an `Image` component in the child blueprint, I have added `class UImage* BackgroundImage` so I can assign the dynamic material from this class. Feel free to omit this and assign in the child blueprint `Event Graph` or use a different component like a `Border` if that is what you need.

I am overriding `NativeConstruct` to create the dynamic material and assign it to the `Image` component. I am also binding to the `ViewportResizedEvent` and calling `UpdateAspectRatio` to get set the `AspectRatio` parameter upon construction:

```cpp
void UTiledIconBackground::NativeConstruct()
{
  Super::NativeConstruct();

  if (BaseMaterial && BackgroundImage)
  {
    DynamicMaterial = UMaterialInstanceDynamic::Create(BaseMaterial, this);
    BackgroundImage->SetBrushFromMaterial(DynamicMaterial);
  }

  if (GEngine && GEngine->GameViewport)
  {
    GEngine->GameViewport->Viewport->ViewportResizedEvent.AddUObject(this, &UTiledIconBackground::OnViewportResized);
  }

  UpdateAspectRatio();
}
```

I am overriding `NativeDestruct` to clean up the `ViewportResizedEvent` binding when this widget is destroyed:

```cpp
void UTiledIconBackground::NativeDestruct()
{
  if (GEngine && GEngine->GameViewport)
  {
    GEngine->GameViewport->Viewport->ViewportResizedEvent.RemoveAll(this);
  }

  Super::NativeDestruct();
}
```

`UpdateAspectRatio` is doing the heavy lifting here but it is pretty simple. Calling `GEngine->GameViewport->GetViewportSize` sets the `Vector2D` parameter (`ViewportSize`) to the current viewport size. If `ViewportSize.Y` is greater than `0` (we don’t want to divide by zero or have a negative aspect ratio), then calculate the aspect ratio using `ViewportSize.X` and `ViewportSize.Y` and assign the result to the `AspectRatio` material parameter:

```cpp
void UTiledIconBackground::UpdateAspectRatio()
{
  if (!DynamicMaterial || !GEngine || !GEngine->GameViewport)
  {
    return;
  }

  FVector2D ViewportSize;
  GEngine->GameViewport->GetViewportSize(ViewportSize);

  if (ViewportSize.Y > 0)
  {
    float AspectRatio = ViewportSize.X / ViewportSize.Y;
    DynamicMaterial->SetScalarParameterValue(TEXT("AspectRatio"), AspectRatio);
  }
}
```

OnViewportResized is the function bound to the ViewportResizedEvent and simply calls UpdateAspectRatio to signal that the viewport has been changed and we need to recalculate the aspect ratio:

```cpp
void UTiledIconBackground::OnViewportResized(FViewport\* Viewport, uint32 Val)
{
  UpdateAspectRatio();
}
```

**Note**: be sure to replace `YOURPROJECT_API` with the correct Module API specifier for your project or plugin. If you created this class using the `Add C++ Class` dialog in the editor than this should already be set correctly.

Also make sure that `PublicDependencyModuleNames` in `[YourProject].Build.cs` includes the `UMG` module:

```cs
PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "EnhancedInput", "UMG" });
```

### Updating the UserWidget blueprint child class

After building these changes and returning to the editor, open up the UserWidget blueprint class from before and update the `Parent Class` under `Class Settings`:

![User Widget Class Settings button](https://miro.medium.com/v2/resize:fit:258/format:webp/1*qAKYTwgG2AgddVaGjTOjBg.png)

![Updating the Parent Class](https://miro.medium.com/v2/resize:fit:676/format:webp/1*59h_4RLybMxgjFCgJKywSA.png)

After compiling, it may warn you that it is missing a component if you specified a component like a `UImage` and used the `meta = (BindWidget)` `UPROPERTY specifier`. Just make sure to add that widget to the hierarchy and to match the name to the C++ property exactly.

With that cleared, the last thing to do is to set the `BaseMaterial` property:

![Inherited BaseMaterial property](https://miro.medium.com/v2/resize:fit:900/format:webp/1*9Www1RjUWc2FXmPx-l_p2Q.png)

![BaseMaterial property settings](https://miro.medium.com/v2/resize:fit:904/format:webp/1*6I0CF1ZxzS4MsAG9BLFYFA.png)

As seen in the above screenshot, you can assign a material instance of the base material. This will allow you to set the other instance variables like `IconColor` and `BackgroundColor` in the material instance without having to manually set the dynamic material parameters at runtime.

You can also leave the `Brush` `Image` property set in the Designer, that way you still get a visual of what it will look like. The parent class will override this in `NativeConstruct`:

![Setting the Image Brush to preview the staggered icon grid in the designer](https://miro.medium.com/v2/resize:fit:1320/format:webp/1*eq4TZ4pKC5Quj_ZBWUz70g.png)

Now when the background is added in game, it adjusts to viewport resizes:

![Staggered icon background in a maximized window](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zTk4g3kRX8tIyDZxJMOKmQ.png)

![Staggered icon background in a wide window](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nPu3V_xC38O-CKfyLeORfQ.png)

Remember that the aspect ratio handling here is setup with the assumption that this widget will take up the full screen. If you are instead only filling a smaller portion of the screen, such as a model or other panel, you will have to calculate the aspect ratio based on that width/height.

## An Example of this Material in Action

To show an example of where I am using this grid material, here’s a few in-progress screenshots from a mini golf game I am developing. The staggered icon grid is providing a dynamic background for all of the menus:

![Example menu screenshot #1](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AnW8SQMLpwsl3rNbsXPGrw.png)

![Example menu screenshot #2](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yHCTaD_BEatHLMYK-VMxWQ.png)

The icon background is pushed to its own layer with the menu content widget on a layer on top. Check out my [UI Layers Manager Plugin](https://medium.com/@bellefeuilledillon/ue5-ui-layers-manager-plugin-4e58034e2e95) tutorial if you’d like to see how I set that up.

The coloring is done using an overlay instead of the `BackgroundColor` and `IconColor` parameters. Everything under the color overlay is in grayscale. For my UI that was easier than setting the color for each component on the screen individuals.

## Conclusion

With a relatively simple material setup, this staggered icon grid material provides an easy way to create a dynamic, fully customizable, and reusable background for any project or game UI.

## Attributions

[Gamepad icon created by sonnycandra — Flaticon](https://www.flaticon.com/free-icons/game-boy-advance)

[Golf Hole icon by Eucalyp](https://www.freepik.com/icon/golf-hole_5492044#fromView=search&page=3&position=72&uuid=e623434f-59e3-48c7-83c4-f73842f4cbfb)
