import { useStore } from 'effector-react'
import { $map, $theme } from '../../../../effector/ui/store'
import { AppTheme, MapStyle } from '../../../../types/theming'

export function useMapStyles() {
  const { style } = useStore($map)
  const theme = useStore($theme)

  if (style === MapStyle.Sputnik) {
    return 'mapbox://styles/movpushmov/clcvvxl8g000714tyfhcntbsn'
  }

  return theme === AppTheme.Dark
    ? 'mapbox://styles/movpushmov/clcuye9sk00h214qn26tiz0a7'
    : 'mapbox://styles/movpushmov/clcvvvcw3000815no5rt55hu8'
}
