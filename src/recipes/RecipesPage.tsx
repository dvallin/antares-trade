import * as React from 'react'
import AllRecipes from './AllRecipes'
import CreateRecipe from './CreateRecipe'

export default (): JSX.Element => (
  <section className="section">
    <h1 className="title">All Recipes</h1>
    <AllRecipes />
    <CreateRecipe />
  </section>
)
