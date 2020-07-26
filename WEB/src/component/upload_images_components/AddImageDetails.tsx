import React, {useRef} from 'react'
import Form from 'react-bootstrap/Form'

const AddImageDetails = ({descriptionCallack, tagsCallback, titleCallback} :any) => {
	const descRef :any = useRef(null);
	const tagsRef :any = useRef(null);
	const titleRef :any = useRef(null);


	const onDescChange = () => {
		descriptionCallack(descRef.current.value);
	};

	const onTagsChange = () => {
		tagsCallback(tagsRef.current.value);
	};

	const onTitleChange = () => {
		titleCallback(titleRef.current.value)
	};

	return (
		<Form>
			<Form.Group>
				<Form.Label>Ecrivez votre Titre !</Form.Label>
				<Form.Control as="textarea" rows="4" placeholder={"Ecrivez votre titre..."} ref={titleRef} onChange={onTitleChange}/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Ecrivez votre Description !</Form.Label>
				<Form.Control as="textarea" rows="4" placeholder={"Ecrivez votre description..."} ref={descRef} onChange={onDescChange}/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Ajoutez des Tags !</Form.Label>
				<Form.Control as="textarea" rows="4" placeholder={"Séparez vos tags par un espace, ex : tag1 tag2..."} ref={tagsRef} onChange={onTagsChange}/>
			</Form.Group>
		</Form>
	);
};

export default AddImageDetails