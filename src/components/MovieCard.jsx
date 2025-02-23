import React from 'react'
import { IMG_CDN_URL } from '../assets/constants'

const MovieCard = ({posterPath}) => {
  return (
    <div className="w-48 pr-4">
      <img alt="Movie Card"
      src={IMG_CDN_URL +posterPath}
      className="object-cover h-full w-full " />




    </div>
  )
}

export default MovieCard