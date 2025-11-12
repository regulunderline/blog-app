const Expand = (props) => {

  const showWhenVisible = { display: props.visible ? '' : 'none' }

  return (
    <div style={showWhenVisible}>
      {props.children}
    </div>
  )
}

export default Expand