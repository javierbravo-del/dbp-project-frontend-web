import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { parseBlocks, parseInline } from '../utils/richText'

function Inline({ text }) {
  return parseInline(text).map((part, index) => {
    if (part.kind === 'bold') return <strong key={index}>{part.value}</strong>
    if (part.kind === 'italic') return <em key={index}>{part.value}</em>
    return <Fragment key={index}>{part.value}</Fragment>
  })
}

Inline.propTypes = { text: PropTypes.string.isRequired }

export default function FormattedText({ text, className = '' }) {
  const blocks = parseBlocks(text)

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'ul' || block.type === 'ol') {
          const ListTag = block.type
          const listStyle = block.type === 'ul' ? 'list-disc' : 'list-decimal'
          return (
            <ListTag key={index} className={`${listStyle} space-y-1 pl-5`}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Inline text={item} />
                </li>
              ))}
            </ListTag>
          )
        }
        return (
          <p key={index}>
            {block.lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                <Inline text={line} />
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

FormattedText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
}
