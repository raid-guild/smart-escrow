export const Button = {
  // Styles for the base style
  baseStyle: {},
  // Styles for the size variations
  sizes: {},
  // Styles for the visual style variations
  variants: {
    primary: {
      minHeight: '40px',
      display: 'block',
      fontFamily: 'rubik',
      fontSize: '1rem',
      fontWeight: 'bold',
      letterSpacing: '1.2px',
      textTransform: 'uppercase',
      color: '#fffffe',
      backgroundColor: '#ff3864',
      border: 'none',
      borderRadius: '3px',
      padding: '12px',
      marginTop: '2rem',
      _hover: {
        cursor: 'pointer',
        backgroundColor: '#16161a',
        color: '#ff3864'
      }
    }
  },
  // The default `size` or `variant` values
  defaultProps: {}
};
