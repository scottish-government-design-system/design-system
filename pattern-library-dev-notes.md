# Dev notes

## Mixins

There are some mixins we can use to enfoce consistency across components with similar displays/pieces.





### Blocklink

`@include blocklink` to apply all of the block-style link properties (such as background colours, transitions, and hover/focus/click states) to components that have a block-level clickable area (accordion header, search result, category item, etc).

#### Params

`linklike-selector`: selector for a child element in the block that needs to look/behave like a regular link & have an underline on hover/focus, such as the title of a search result (default: `.linklike`)

#### Example

    .ds_search-result {
        @include blocklink('.ds_search-result__title');
        ...
    }





### Chevron

`@include chevron` to create a pure-CSS chevron icon. It's a little raw and will need some positioning adjustments.

#### Params

`direction`: up, down, left, right (default: down)  
`size`: size (height/width) of the chevron (default: 1em)  
`width`: width of the lines making up the chevrons (default: 3px)

#### Example

    .ds_sequential-nav__icon {
        @include chevron(left, 30px 5px);
        ...
    }





### Fancy underscore

`@include fancy-underscore` to apply an animated underscore to fancy links, such as logos and primary navigation.

#### Param

`width`: thickness of the underscore (default 1px)

#### Example
    .ds_site-branding__link {
        color: currentColor;
        display: inline-block;
        position: relative;
        text-decoration: none;

        @include fancy-underscore(2px);
    }




### Block margins

`@include block-margins` to apply a standard margin above and below a block, to help enforce consistency in these blocks' spacing




### Indicator

`@include indicator` to add an open/close indicator to things like accordions. The indicator may need some additional placement rules according to where it's being used, but the optional "topOffset" parameter will cover the majority of cases.

#### Param

`topOffset`: spacing between the top of the parent container and the top of the indicator icon

#### Modifier "Open"

Also include `@include indicator--open` to use the "open" version of the indicator. The modifier can take its own topOffset parameter

#### Example

    .ds_accordion__indicator {
        @include indicator(16px);
    }

    .ds_accordion--open .ds_accordion__indicator {
        @include indicator--open(20px);
    }




## Sprites

Design System SVG icons should be compiled into a sprite so we can embed them in a way that lets us control them with CSS.

Icons should be placed into `/src/images/icons/svg`

Compile the sprite by running `$ npm run svgpsrites`

Output sprite will be located at `/dist/images/icons/icons.stack.svg`

#### Example of use:

    <svg class="ds_icon"><use xlink:href="/path/to/pattern-library/images/icons/icons.stack.svg#search"></use></svg>
