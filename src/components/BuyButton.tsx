import { AddShoppingCart } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import React from 'react'
import { OriginalGame } from '../types/types'

interface BuyButtonProps {
  isBoughtGame: boolean,
  game: OriginalGame,
  handleOnClickBuy: () => void,
}

export default function BuyButton({isBoughtGame, game, handleOnClickBuy}: BuyButtonProps) {
  return (
    <Typography
    sx={{
      marginBlock: 1,
    }}
  >
    {isBoughtGame ? (
      <Button variant="contained" href={game.game_file}>
        Download
      </Button>
    ) : (
      <Button
        onClick={handleOnClickBuy}
        variant="contained"
        sx={{
          gap: 1,
        }}
      >
        <AddShoppingCart />
        R${game.price.toFixed(2)}
      </Button>
    )}
  </Typography>
  )
}
