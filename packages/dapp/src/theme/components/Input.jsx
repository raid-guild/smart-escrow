export const Input = {
  // Styles for the base style
  baseStyle: {},
  // Styles for the size variations
  sizes: {},
  // Styles for the visual style variations
  variants: {
    secondary: {
      width: '350px',
      height: '50px',
      fontFamily: 'spaceMono',
      textTransform: 'uppercase',
      border: '2px solid',
      borderRadius: '3px',
      borderImageSlice: 1,
      borderImageSource:
        'linear-gradient(95.58deg, #FF3864 0%, #8B1DBA 53.65%, #4353DF 100%)',
      backgroundColor: 'transparent',
      paddingLeft: '24px',
      paddingRight: '24px',
      transistion: 'all .8s ease-out',
      _hover: {
        background:
          'linear-gradient(96.18deg, #e26f88 0%, #a15ebe 53.65%, #6c77db 100%)',
        backgroundClip: 'text'
      }
    }
  },
  // The default `size` or `variant` values
  defaultProps: {}
};
