import { useColors } from '../../../composables'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTestComposable } from '../../../composables/tests/createTestComposable'

// need this doc block to run test with right environment, when press integrated by Webstorm buttons near the test
/**
 * @vitest-environment jsdom
 */
describe('useColors', () => {
  const {
    composableWrapper: {
      setColors,
      getColors,
      getColor,
      getBoxShadowColor,
      getHoverColor,
      getFocusColor,
      getGradientBackground,
      getTextColor,
      shiftHSLAColor,
      setHSLAColor,
      colorsToCSSVariable,
    },
  } = createTestComposable(useColors)

  describe('with console.warn ignore', () => {
    const ignoreWarnings = () => {
      vi.spyOn(console, 'warn').mockImplementation(() => ({}))
    }
    beforeEach(() => {
      ignoreWarnings()
    })
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it.each([
      [['primary', undefined, false], '#2C82E0'],
      [['#000', undefined, false], '#000'],
      [['var(--va-primary)', undefined, false], '#2C82E0'],
      [['bad-color', '#000', false], '#000'],
      [['secondary', undefined, true], 'var(--va-secondary)'],
    ])(
      'getColorArgs %s should be %s',
      (getColorArgs, expected) => {
        expect(getColor(...getColorArgs)).toBe(expected)
      },
    )

    it.each([
      [[{ color: '#000' }, 'va-test'], { '--va-test-color': '#000' }],
      [[{ color: 'secondary' }, 'va-test'], { '--va-test-color': 'var(--va-secondary)' }],
      [[{ color: 'var(--va-primary)' }, 'va-test'], { '--va-test-color': 'var(--va-primary)' }], // TODO call Oleg
      [[{ color: 'bad-color' }, 'va-test'], { '--va-test-color': '#2C82E0' }],
      [[{}, 'va-test'], {}],
    ])(
      'colorToCssVariableArgs %s should be %s',
      (colorToCssVariableArgs, expected) => {
        expect(colorsToCSSVariable(...colorToCssVariableArgs)).toMatchObject(expected)
      },
    )
  })

  it.each([
    [{ testColor1: '#000000' }],
    [{ testColor1: '#000000', testColor2: '#FFFFFF' }],
    [{ primary: '#000000' }],
  ])(
    'setColorsArg %s should returned by getColorsValue',
    (setColorsArg) => {
      setColors(setColorsArg)

      const setColorArgKeys = Object.keys(setColorsArg)
      const getColorsKeys = Object.keys(getColors())
      expect(getColorsKeys).toEqual(expect.arrayContaining(setColorArgKeys))

      Object.entries(setColorsArg).forEach((el, index) => {
        expect(getColors()[setColorArgKeys[index]]).toBe(el[1])
      })
    },
  )

  it.each([
    ['#000000', 'rgba(0,0,0,0.4)'],
    ['rgb(0, 0, 0)', 'rgba(0,0,0,0.4)'],
    ['rgba(0, 0, 0, 1)', 'rgba(0,0,0,0.4)'],
    [{ h: 0, s: 0, l: 0 }, 'rgba(0,0,0,0.4)'],
    [{ c: 0, m: 0, y: 0, k: 0 }, 'rgba(255,255,255,0.4)'],
  ])(
    'getBoxShadowColorArg %s should return %s',
    (getBoxShadowColorArg, expected) => {
      expect(getBoxShadowColor(getBoxShadowColorArg)).toBe(expected)
    },
  )

  it.each([
    ['#000000', 'rgba(0,0,0,0.2)'],
    ['rgb(0, 0, 0)', 'rgba(0,0,0,0.2)'],
    ['rgba(0, 0, 0, 1)', 'rgba(0,0,0,0.2)'],
    [{ h: 0, s: 0, l: 0 }, 'rgba(0,0,0,0.2)'],
    [{ c: 0, m: 0, y: 0, k: 0 }, 'rgba(255,255,255,0.2)'],
  ])(
    'getHoverColor %s should return %s',
    (getHoverColorArg, expected) => {
      expect(getHoverColor(getHoverColorArg)).toBe(expected)
    },
  )

  it.each([
    ['#000000', 'rgba(0,0,0,0.3)'],
    ['rgb(0, 0, 0)', 'rgba(0,0,0,0.3)'],
    ['rgba(0, 0, 0, 1)', 'rgba(0,0,0,0.3)'],
    [{ h: 0, s: 0, l: 0 }, 'rgba(0,0,0,0.3)'],
    [{ c: 0, m: 0, y: 0, k: 0 }, 'rgba(255,255,255,0.3)'],
  ])(
    'getFocusColorArg %s should return %s',
    (getFocusColorArg, expected) => {
      expect(getFocusColor(getFocusColorArg)).toBe(expected)
    },
  )

  it.each([
    ['#000000', 'linear-gradient(to right, hsla(2,5%,10%,1), hsla(0,0%,0%,1))'],
    ['rgb(0, 0, 0)', 'linear-gradient(to right, hsla(2,5%,10%,1), hsla(0,0%,0%,1))'],
    ['rgba(0, 0, 0, 1)', 'linear-gradient(to right, hsla(2,5%,10%,1), hsla(0,0%,0%,1))'],
    [{ h: 0, s: 0, l: 0 }, 'linear-gradient(to right, hsla(2,5%,10%,1), hsla(0,0%,0%,1))'],
    [{ c: 0, m: 0, y: 0, k: 0 }, 'linear-gradient(to right, hsla(2,5%,100%,1), hsla(0,0%,100%,1))'],
  ])(
    'getGradientBackgroundArg %s should return %s',
    (getGradientBackgroundArg, expected) => {
      expect(getGradientBackground(getGradientBackgroundArg)).toBe(expected)
    },
  )

  it.each([
    [['#000000', '#CCCCCC', '#FFFFFF'], '#FFFFFF'],
    [['rgb(255, 255, 255)'], 'dark'],
    [[{ h: 0, s: 100, l: 27 }], 'white'],
    [[{ c: 0, m: 0, y: 0, k: 0 }], 'dark'],
  ])(
    'getTextColorArgs %s should return %s',
    (getTextColorArgs, expected) => {
      expect(getTextColor(...getTextColorArgs)).toBe(expected)
    },
  )

  it.each([
    [['#000000', {}], 'hsla(0,0%,0%,1)'],
    [['rgb(255, 255, 255)', { h: 1, s: 2 }], 'hsla(1,2%,100%,1)'],
    [[{ h: 0, s: 100, l: 27 }, { h: 1, s: 2, l: 3, a: 4 }], 'hsla(1,100%,30%,1)'],
    [[{ c: 0, m: 0, y: 0, k: 0 }, { l: 3 }], 'hsla(0,0%,100%,1)'],
  ])(
    'shiftHSLAColorArgs %s should return %s',
    (shiftHSLAColorArgs, expected) => {
      expect(shiftHSLAColor(...shiftHSLAColorArgs)).toBe(expected)
    },
  )

  it.each([
    [['#000000', {}], 'hsla(0,0%,0%,1)'],
    [['rgb(255, 255, 255)', { h: 1, s: 2 }], 'hsla(1,2%,100%,1)'],
    [[{ h: 0, s: 100, l: 27 }, { h: 1, s: 2, l: 3, a: 4 }], 'hsla(1,2%,3%,1)'],
    [[{ c: 0, m: 0, y: 0, k: 0 }, { l: 3 }], 'hsla(0,0%,3%,1)'],
  ])(
    'setHSLAColorArgs %s should return %s',
    (setHSLAColorArgs, expected) => {
      expect(setHSLAColor(...setHSLAColorArgs)).toBe(expected)
    },
  )
})
