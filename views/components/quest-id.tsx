import React from 'react'
import styled from 'styled-components'

import { questCategoryColor } from '../utils/quest-category'

// Same geometry as the indicator poi puts beside a quest in its task panel --
// see `CatIndicator` in poi's views/components/main/parts/task-panel.tsx.
const CatIndicator = styled.span`
  display: inline-block;
  flex: none;
  height: 1em;
  width: 4px;
  margin-right: 4px;
  margin-top: -1px;
  vertical-align: middle;
`

const QuestId: React.FC<{ wikiId: string; category: string }> = ({ wikiId, category }) => (
  <>
    <CatIndicator style={{ backgroundColor: questCategoryColor(category, wikiId) }} />
    {wikiId}
  </>
)

export default QuestId
