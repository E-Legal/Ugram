import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class ChangeUserInfosModals extends React.Component<any, any> {
  constructor(props: { show: any }) {
    super(props)
    this.state = ({
      showModal: false,
      showModalLastName: false,
      showModalEmail: false,
      showModalNumber: false,
      name: "",
      lastname: "",
      email: "",
      number: ""
    })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>, setId: number) => {
    switch (setId) {
      case 1: {
        this.setState({
          name: event.target.value
        });
        break
      }
      case 2: {
        this.setState({
          lastname: event.target.value
        });
        break
      }
      case 3: {
        this.setState({
          email: event.target.value
        });
        break
      }
      case 4: {
        this.setState({
          number: event.target.value
        });
        break
      }
    }
  };

  componentWillReceiveProps(nextProps: { showModal: any; showModalLastName: any; showModalEmail: any; showModalNumber: any }) {
    const oldProps = this.props;
    if (oldProps.showModal !== nextProps.showModal) {
      this.setState({
        showModal: nextProps.showModal
      })
    } else if (oldProps.showModalLastName !== nextProps.showModalLastName) {
      this.setState({
        showModalLastName: nextProps.showModalLastName
      })
    } else if (oldProps.showModalEmail !== nextProps.showModalEmail) {
      this.setState({
        showModalEmail: nextProps.showModalEmail
      })
    } else if (oldProps.showModalNumber !== nextProps.showModalNumber) {
      this.setState({
        showModalNumber: nextProps.showModalNumber
      })
    }
  }

  render() {
    return (
      <div className="contrainer">
        <Modal show={this.state.showModal} onHide={() => this.props.handleModalClick(1)} centered>
          <Modal.Body>
            <Form.Group >
              <Form.Label>Type your new name:</Form.Label>
              <Form.Control type="Text" placeholder="Name" value={this.state.name} onChange={(event: any) => { this.handleChange(event as any, 1) }} autoFocus />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.handleModalClick(1)} size="sm">
              Close
          </Button>
            <Button variant="primary" onClick={() => {
              this.props.handleUserSaveChange(1, this.state.name)
              this.props.handleModalClick(1)
            }} size="sm">
              Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showModalLastName} onHide={() => this.props.handleModalClick(2)} centered>
          <Modal.Body>
            <Form.Group >
              <Form.Label>Type your new last name:</Form.Label>
              <Form.Control type="Text" placeholder="Last name" value={this.state.lastname} onChange={(event: any) => this.handleChange(event as any, 2)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.handleModalClick(2)} size="sm">
              Close
          </Button>
            <Button variant="primary" onClick={() => {
              this.props.handleUserSaveChange(2, this.state.lastname)
              this.props.handleModalClick(2)
            }} size="sm">
              Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showModalEmail} onHide={() => this.props.handleModalClick(3, this.state.email)} centered>
          <Modal.Body>
            <Form.Group >
              <Form.Label>Type your new email:</Form.Label>
              <Form.Control type="Text" placeholder="Email" value={this.state.email} onChange={(event: any) => this.handleChange(event as any, 3)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.handleModalClick(3)} size="sm">
              Close
          </Button>
            <Button variant="primary" onClick={() => {
              this.props.handleUserSaveChange(3, this.state.email)
              this.props.handleModalClick(3)
            }} size="sm">
              Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showModalNumber} onHide={() => this.props.handleModalClick(4, this.state.number)} centered>
          <Modal.Body>
            <Form.Group >
              <Form.Label>Type your new number:</Form.Label>
              <Form.Control type="Text" placeholder="Phone number" value={this.state.number} onChange={(event: any) => this.handleChange(event as any, 4)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.handleModalClick(4)} size="sm">
              Close
          </Button>
            <Button variant="primary" onClick={() => {
              this.props.handleUserSaveChange(4, this.state.number)
              this.props.handleModalClick(4)
            }} size="sm">
              Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ChangeUserInfosModals