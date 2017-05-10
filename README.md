# Numbering Machine
[Sketch](https://www.sketchapp.com/) plugin to generate PDF document based on selected artboards with generated numbers, like Numbering Machine does.

# How to install
1. [Download the latest release](https://github.com/akolpakov/sketch-numbering-machine/archive/master.zip) and open it
2. Duble click on `Numbering Machine.sketchplugin` to install the plugin

# How to use

![NumberingMachine](https://cdn.rawgit.com/akolpakov/sketch-numbering-machine/8bb84f2e/how-to-use.gif)

> You can see it in more detail on [Vimeo](https://vimeo.com/199833210).

1. Create text layer with any content with name `NM`, this layer will be replaced with generated number. *(Five different IDs could be placed on one artboard)*
3. Select artboards wich you are going to export. *(You can select several artboards)*
4. Run plugin (`Plugins -> Numbering machine -> Export selected artboards`)
5. Configure numbering machine (see below)
6. Generate and save PDF file

### Basic

`Start from number` - From which number we should start the numbering

`Generate amount` - Amount of pages to be generated

### Advanced

`Template` - Template for number. Placeholder `[*]` have to be part of tempate. Placeholder `[*]` will be replaced with generated number

`Pad size` - How many leading zeros will be in generated number

`Check digit` - Apply [check digit algorithm](https://en.wikipedia.org/wiki/Check_digit) to generated number. Supported algorithms:
- [**Damm Algorithm**](https://en.wikipedia.org/wiki/Damm_algorithm)

`Start from number` - From which number we should start the numbering

`Step` - Generate numbers with step (default 1).

`Generate amount` - Amount of pages to be generated

`Numbering direction` - Which direction to use for numbering. Very similar to "Layout direction" in printer settings. There are two options:
- "Direct sequence" (NM-1 -> NM-2 -> NM-3). When we are numbering all layers on the one page, then all on the second and so forth
- "Drill sequence" (NM-1 -> NM-1 -> ... -> NM-1 -> NM-2 ...). When we are numbering all layers with name `NM-1` on all pages, then numbering all `NM-2` on oll pages and so forth

# License
[MIT licence](./LICENSE)
