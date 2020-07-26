import React from 'react'
import ImageComponent, {ImageInfos} from './Image'
import "../css/search.css"
import { Button } from 'react-bootstrap'

class SingleImage extends React.Component<ImageInfos> {

  render() {
   return (
       <div>
           <ImageComponent {...this.props} />
           <Button onClick={() => {

           }}>Delete</Button>
       </div>
      )
    }
}

export default SingleImage
