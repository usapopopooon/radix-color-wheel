import '@testing-library/jest-dom'

// Mock Pointer Capture API for jsdom
// These APIs are not implemented in jsdom
Element.prototype.setPointerCapture = function () {}
Element.prototype.releasePointerCapture = function () {}
Element.prototype.hasPointerCapture = function () {
  return false
}
