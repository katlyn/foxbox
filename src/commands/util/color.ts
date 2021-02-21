import { CommandClient, MessageContent } from 'eris'
import difflib from 'difflib'
import namedColors from 'color-name-list'
import nearestColor, { ColorMatch } from 'nearest-color'
import { URL } from 'url'

const colorMap = namedColors.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {})
const colorNames = Object.keys(colorMap)
const findNearest = nearestColor.from(colorMap)

const hexTest = /^#?((?:[0-9a-f]{6})|(?:[0-9a-f]{3}))$/i
const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

// From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgb = (hex: string): ColorMatch['rgb'] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

const generateMessage = (query: string, name: string, distance: number): MessageContent => {
  const embedURL = new URL('https://math.katlyn.dev/render')
  embedURL.searchParams.set('input', 'latex')
  embedURL.searchParams.set('output', 'png')
  embedURL.searchParams.set('width', '500')
  embedURL.searchParams.set('foreground', query)
  embedURL.searchParams.set('source', `\\text{${query.toUpperCase()}}`)

  const rgb = hexToRgb(query)

  const red = (rgb.r / 255 * 100).toFixed(2)
  const blue = (rgb.b / 255 * 100).toFixed(2)
  const green = (rgb.g / 255 * 100).toFixed(2)
  return {
    embed: {
      color: parseInt(query.substr(1), 16),
      description: `${name} (\`${query}\`) is comprised of ${red}% red, ${green}% green, and ${blue}% blue.`,
      image: {
        url: embedURL.toString()
      },
      footer: {
        text: distance === 0
          ? `${name} is an exact match for this color.`
          : `${name} is an approximation for this color, with an error of ${distance.toFixed(2)}.`
      }
    }
  }
}

const init = (bot: CommandClient): void => {
  bot.registerCommand('color', async (msg, args) => {
    const query = args.join(' ').toLowerCase()
    const hexMatches = query.match(hexTest)
    if (hexMatches !== null) {
      let hex = hexMatches[1]
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      hex = hex.replace(shorthandRegex, (m, r: string, g: string, b: string) => {
        return r + r + g + g + b + b
      })
      const color = findNearest(hex)
      await msg.channel.createMessage(generateMessage(`#${hex}`, color.name, color.distance))
    } else {
      let named = namedColors.find(c => c.name.toLowerCase() === query)
      if (named === undefined) {
        const closeMatch = difflib.getCloseMatches(query, colorNames)[0]
        named = namedColors.find(c => c.name.toLowerCase() === closeMatch)
      }
      if (named === undefined) {
        named = namedColors.find(c => c.name.toLowerCase().includes(query))
      }
      if (named === undefined) {
        return 'I don\'t know about that color D: make sure you didn\'t misspell or give me malformed input >~<'
      }

      await msg.channel.createMessage(generateMessage(named.hex, named.name, 0))
    }
  }, {
    usage: 'utility',
    description: 'Lookup an information on a hex color code.'
  })
}

export default {
  init
}
