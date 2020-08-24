import React from 'react'

const Usage = () => {
  const [show, setshow] = React.useState(false)

  const ShowInfo = () => {
    return (
      <>
        <ul>
          <li>
            Mouse drag - Click the mouse and drag to select a cell range and
            this will clear any existing selected cells/ranges
            <li>
              Ctrl + Mouse drag - Holding Ctr and Mouse drag will select
              multiple cell ranges and this keeps all existing selected
              cells/ranges
            </li>
            <li>
              Ctrl + click - For cell selection and this keeps all existing
              selected cells/ranges
            </li>
          </li>
        </ul>
        <p>
          <code>getEdgeScrollingProps()</code>: Start selecting cell range and
          move near edges, table scrolls for you.
        </p>
      </>
    )
  }

  return (
    <>
      {' '}
      <button onClick={() => setshow(o => !o)}>
        <span title='More Info'>💡</span>
      </button>
      {show && <ShowInfo></ShowInfo>}
    </>
  )
}

export default Usage
