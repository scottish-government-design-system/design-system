# Responsive spacing and REM units

## General notes

Font sizes in type settings are left in PX. These are converted to REM in the font size mixins (ds_h1-size, etc) and not in the type settings because I want to use those pixel values elsewhere.

Line heights for headings and leader text have been converted to relative (unitless) values, and are baked into the font size mixins so that anywhere we use e.g. ds_h1-size the line height is included with it (I have not stripped out the old fixed line heights everywhere yet).

I've gone through all of the base styles and components looking for places where we can add responsive spacing mixins. I've left fixed pixel values in places where margins do not change between viewport sizes. It felt redundnt to do so, but I can see arguments for changing them and for leaving them. Something to discuss, I guess.

And with that preamble over, here's some other notes on what I think should be included in this work. Might not be exhaustive, but hey.

## Things to consider REMming

### Font sizes

Doesn't really bear mentioning, but I'm noting it here because it's basically done.

### Margins/padding

REM might be more complex than EM, though the px-to-rem function might be able to handle things for us. Interaction between responsive margin/padding functions and the conversion to REM might be fiddly.

### Line heights
Is this necessary? It looks like browsers scale this well with pixels, but the hardcoding to px isn't great.
Not wholly related to the REM work, but could we introduce a function that calculates line height to the nearest multiple of 8px (and then make a relative value)?

It would be nice if we could have a way of automatically providing a line height. This has been roughly sketched out in the type settings/mixins. It's not ready for primetime and is untested.

### Element heights

Buttons, inputs, etc? IIRC we use min-height most places which is fine.

## Items changed to use responsive spacing measurements

### Base

HR (this was fixed at 32px on all viewports. Have changed to 24/32, which feels better)

### Components

* Article aside
* Notification panel (it was already done)
* Warning text

### Forms

* Question


## Specific issues/notes

### Base

* Headings: H1 has margins on mobile/desktop that do not match responsive scale (32px both, closest in responsive is 24px/32px or 32px/40px)

### Components

* Article aside LI bottom margin: 8px/16px bottom margin (responsive 1 is 8/8, 2 is 16/16)
* Breadcrumbs: ds_breadcrumbs__container has spacing that doesn't fit the responsive sizes. Also, what is this container for? Is it legacy code that should be deleted?
* Callout: padding doesn't match responsive sizes, callout also a v low priority component so meh?
* Card: Not touching this yet -- whole component needs some review now we have firmer use cases thanks to gov
* Page header: top margin doesn't fit responsive scale (it is 16/32)

## And a rando query prompted by DK's observation that leader is larger than H3

H3 sizes are 19px mobile 22px larger. Leader is 19/24. Should we just make those use the same size for larger viewports (one for Sarah/Kevin).
