import { nextTick, Ref } from 'vue'
import { useDocument } from './useDocument'
import { useWindow } from './useWindow'

const TAB_KEYCODE = 9
const FOCUSABLE_ELEMENTS_SELECTOR = ':where(a, button, input, textarea, select):not([disabled]), *[tabindex]'

export const useTrapFocus = (trapInEl: Ref<HTMLElement | undefined | null>) => {
  const document = useDocument()
  const window = useWindow()

  let focusableElements: HTMLElement[] = []
  let firstFocusableElement: HTMLElement | null = null
  let lastFocusableElement: HTMLElement | null = null
  let isFocusTrapped = false

  const focusFirstElement = () => {
    if (firstFocusableElement) {
      firstFocusableElement.focus()
    }
  }
  const focusLastElement = () => {
    if (lastFocusableElement) {
      lastFocusableElement.focus()
    }
  }

  const onKeydown = (evt: KeyboardEvent) => {
    const isTabPressed = evt.key === String(TAB_KEYCODE) || evt.keyCode === TAB_KEYCODE
    const isShiftPressed = evt.shiftKey

    if (!isTabPressed) {
      return
    }

    if (!isFocusTrapped) {
      isFocusTrapped = true

      evt.preventDefault()
      isShiftPressed ? focusLastElement() : focusFirstElement()

      return
    }

    if (document.value?.activeElement === lastFocusableElement && !isShiftPressed) {
      evt.preventDefault()
      focusFirstElement()

      return
    }

    if (document.value?.activeElement === firstFocusableElement && isShiftPressed) {
      evt.preventDefault()
      focusLastElement()
    }
  }

  const trapFocus = () => {
    nextTick(() => {
      console.log('trap')
      if (!trapInEl.value) {
        return
      }

      focusableElements = Array.from(trapInEl.value.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR))
      firstFocusableElement = focusableElements[0]
      lastFocusableElement = focusableElements[focusableElements.length - 1]

      window.value?.addEventListener('keydown', onKeydown)
    })
  }
  const freeFocus = () => {
    console.log('free')
    focusableElements = []
    firstFocusableElement = null
    lastFocusableElement = null
    isFocusTrapped = false

    window.value?.removeEventListener('keydown', onKeydown)
  }

  return {
    trapFocus,
    freeFocus,
  }
}
