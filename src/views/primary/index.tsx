import React from "react"
import { PHeader } from "./components/Header"
import { PList } from "./components/List"
export const Primary = () => {
  const primaryObj = {
    name: "Primary Market",
    description:
      "Primary is a marketplace that allows high-quality projects, artists, and celebrities to conduct the primary list of NFT assets. Users or players can place orders before the NFT flows into the secondary marketplace to obtain a better price or the priority to experience the project in advance.",
  }
  return (
    <div className="primary-market-wrap">
      <PHeader primaryObj={primaryObj} />
      <PList />
    </div>
  )
}
