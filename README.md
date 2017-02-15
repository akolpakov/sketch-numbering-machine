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

`Number from` - From which number should we start numbering

`Amount` - Amount of pages generated

### Advanced

`Template` - Template for number. Placeholder `[*]` have to be part of tempate. Placeholder `[*]` will be replaced with generated number

`Pad size` - How many leading zeros will be in generated number

`Check digit` - Apply [check digit algorithm](https://en.wikipedia.org/wiki/Check_digit) to generated number. Supported algorithms:
- [**Damm Algorithm**](https://en.wikipedia.org/wiki/Damm_algorithm)

`Amount` - Amount of pages generated

`Step` - Generate numbers with step (default 1).

`Number form` - Set of settings to define starting number for each number on your artboards. 
Several generators could be useful if you have several documents on the one artboard.
For example, with settings:

| Layer | Start from number |
| ------- |:---:|
| `NM-1`  | 1   |
| `NM-2`  | 100 |
| `NM-3`  | 200 |

- For layers with names `NM-1` number will be generated starting from 1
- For layers with names `NM-2` number will be generated starting from 100
- For layers with names `NM-3` number will be generated starting from 200

# License
[MIT licence](./LICENSE)
