import './index.css'
import { useRef, useState } from 'react'
import image from '../../assets/Cursive-Capital-N.png'

import WhiteBoard from '../../components/WhiteBoard'

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [tool, setTool] = useState('pencil')
  const [color, setColor] = useState('#000000')
  const [elements, setElements] = useState([])
  const [history, setHistory] = useState([])
  const [openedUserTab, setOpenedUserTab] = useState(false)

  const handleClearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillRect = 'white'
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setElements([])
  }

  const handleUndo = () => {
    setHistory((prevHistory) => [...prevHistory, elements[elements.length - 1]])
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    )
  }

  const handleRedo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ])
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1))
  }
  return (
    <div className="row">
      <nav class="navbar navbar-light bg-light justify-content-between mb-3 p-1">
        <img
          src={image}
          style={{ width: '50px', height: '50px' }}
          class="navbar-brand "
        />
        <p className="text-center ">
          {user.name}{' '}
          <span className="text-primary">[Users Online : {users.length}]</span>
        </p>
      </nav>
      <div className="row">
        <button
          type="button"
          className="btn btn-dark"
          style={{
            display: 'block',
            position: 'absolute',
            top: '5%',
            right: '3%',
            height: '40px',
            width: '100px',
          }}
          onClick={() => {
            setOpenedUserTab(true)
          }}
        >
          Users
        </button>
        {openedUserTab && (
          <div
            className="position-fixed top-0 h-100 text-white bg-dark"
            style={{ width: '250px', right: '0%' }}
          >
            <button
              type="button"
              onClick={() => setOpenedUserTab(false)}
              className="btn btn-light btn-block w-100 mt-5"
            >
              Close
            </button>
            <div className="w-100 mt-5 pt-5">
              {users.map((usr, index) => (
                <p key={index * 999} className="my-2 text-center w-100 ">
                  {usr.name} {user && user.userId === usr.userId && '(you)'}
                </p>
              ))}
            </div>
          </div>
        )}

        {user?.presenter && (
          <div className="col-md-10 mx-auto px-5 mb-3 d-flex align-items-center">
            <div className="d-flex col-md-2 justify-content-center gap-1">
              <div className="d-flex gap-1 align-items-center">
                <label htmlFor="pencil">Pencil</label>
                <input
                  type="radio"
                  id="pencil"
                  name="tool"
                  checked={tool === 'pencil'}
                  value="pencil"
                  className="mt-1"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
              <div className="d-flex gap-1">
                <label htmlFor="line">Line</label>
                <input
                  type="radio"
                  id="line"
                  name="tool"
                  checked={tool === 'line'}
                  value="line"
                  className="mt-1"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
              <div className="d-flex gap-1">
                <label htmlFor="rect">Rectangle</label>
                <input
                  type="radio"
                  id="rect"
                  name="tool"
                  checked={tool === 'rect'}
                  value="rect"
                  className="mt-1"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 mx-auto">
              <div className="d-flex align-items-center justify-content-center">
                <label htmlFor="color">Select Color: </label>
                <input
                  type="color"
                  id="color"
                  className="mt-1 ms-3"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button
                className="btn btn-primary mt-1"
                disabled={elements.length === 0}
                onClick={() => handleUndo()}
              >
                Undo
              </button>
              <button
                className="btn btn-outline-primary mt-1"
                disabled={history.length < 1}
                onClick={() => handleRedo()}
              >
                Redo
              </button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-danger" onClick={handleClearCanvas}>
                Clear Canvas
              </button>
            </div>
          </div>
        )}

        <div className="col-md-10 mx-auto mt-4 canvas-box">
          <WhiteBoard
            canvasRef={canvasRef}
            contextRef={contextRef}
            elements={elements}
            setElements={setElements}
            color={color}
            tool={tool}
            user={user}
            socket={socket}
          />
        </div>
      </div>
    </div>
  )
}

export default RoomPage
