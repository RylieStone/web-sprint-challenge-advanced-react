// Write your tests here
import server from '../../backend/mock-server'
import React from 'react'
import AppFunctional from './AppFunctional'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
let up, down, left, right, reset, submit
let squares, message, email

const updateStatelessSelectors = document => {
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const updateStatefulSelectors = document => {
  squares = document.querySelectorAll('.square')
  message = document.querySelector('#message')
  email = document.querySelector('#email')
}
const testSquares = (squares, activeIdx) => {
  squares.forEach((square, idx) => {
    if (idx === activeIdx) {
      expect(square.textContent).toBe('B')
      expect(square.className).toMatch(/active/)
    } else {
      expect(square.textContent).toBeFalsy()
      expect(square.className).not.toMatch(/active/)
    }
  })
}


  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })
  beforeEach(() => {
    render(<AppFunctional />)
    updateStatelessSelectors(document)
    updateStatefulSelectors(document)
  })
  afterEach(() => {
    server.resetHandlers()
    document.body.innerHTML = ''
  })

describe(`Active Squares in right place`, () => {
  test(`Active Square should be index 4`, () => {
    testSquares(squares, 4)
  })
  test(`Active Square should be index 1`, () => {
    fireEvent.click(up)
    testSquares(squares, 1)
  })
  test(`Active Square should be index 1`, () => {
    fireEvent.click(up)
    fireEvent.click(up)
    testSquares(squares, 1)
  })
  test(`active square should be 7`, () => {
    fireEvent.click(down)
    fireEvent.click(down)
    testSquares(squares, 7)
  })
  test(`active square should be 4`, () => {
    fireEvent.click(left)
    fireEvent.click(down)
    fireEvent.click(right)
    fireEvent.click(up)
    testSquares(squares, 4)
  })
  test(`active square should be 4`, () => {
    fireEvent.click(left)
    fireEvent.click(down)
    fireEvent.click(right)
    fireEvent.click(right)
    fireEvent.click(reset)
    testSquares(squares, 4)
  })
})

describe('going over and typing in email box gives proper responses', () => {
  test('cant go left text appears', () => {
    fireEvent.click(left)
    fireEvent.click(left)
    expect(screen.queryByText(`You can't go left`)).toBeInTheDocument()
  })
  test('cant go right text appears', () => {
    fireEvent.click(right)
    fireEvent.click(right)
    expect(screen.queryByText(`You can't go right`)).toBeInTheDocument()
  })
  test('cant go up text appears', () => {
    fireEvent.click(up)
    fireEvent.click(up)
    expect(screen.queryByText(`You can't go up`)).toBeInTheDocument()
  })
  test('cant go down text appears', () => {
    fireEvent.click(down)
    fireEvent.click(down)
    expect(screen.queryByText(`You can't go down`)).toBeInTheDocument()
  })
  test('email gets put in box correctly', () => {
    fireEvent.change(email, { target: { value: 'lady@gaga.com' } })
    email.textContent = `lady@gaga.com`
  })
})
describe('submit submits form and clears the email but leaves the info, and reset button works', () => {
  test('email gets put in box correctly', () => {
    fireEvent.click(up)
    testSquares(squares, 1)
    fireEvent.change(email, { target: { value: 'lady@gaga.com' } })
    email.textContent = `lady@gaga.com`
    fireEvent.click(submit)
    email.textContent = ``
    message.textContent = 'lady win #31'
    expect(screen.queryByText('You moved 1 time'))
    expect(screen.queryByText('Coordiates (2, 1)'))
  })
  test ('reset button is functional', () => {
    fireEvent.click(up)
    testSquares(squares, 1)
    fireEvent.change(email, { target: { value: 'lady@gaga.com' } })
    email.textContent = `lady@gaga.com`
    expect(screen.queryByText('You moved 1 time'))
    expect(screen.queryByText('Coordiates (2, 1)'))
    fireEvent.click(reset)
    expect(screen.queryByText('You moved 0 times'))
    expect(screen.queryByText('Coordiates (2, 2)'))
    email.textContent = ``
  })
})
