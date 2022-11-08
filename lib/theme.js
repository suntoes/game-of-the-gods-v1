import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: props => ({
    body: {
      bg: mode('#f3ece3', '#282828')(props),
      fontFamily: `"Solid-Mono", sans-serif`
    },
    '@font-face': {
      fontFamily: 'Solid-Mono',
      fontWeight: 400,
      src: `url("/fonts/Solid-Mono.ttf") format('truetype')`
    }
  })
}

const components = {
  Heading: {
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 36,
        textUnderlineOffset: 6,
        textDecorationColor: '#525252',
        marginTop: 3,
        marginBottom: 4
      }
    }
  },
  Link: {
    baseStyle: props => ({
      color: mode('red', 'yellow')(props),
      textUnderlineOffset: 3
    })
  }
}

const fonts = {
  heading: `"Solid-Mono", sans-serif`
}

const colors = {}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

const theme = extendTheme({ colors, components, config, fonts, styles })
export default theme
