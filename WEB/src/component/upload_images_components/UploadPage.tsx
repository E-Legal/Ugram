import React, {useState} from 'react'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import DragNDropZone  from './DragNDropZone'
import AddImageDetails from './AddImageDetails'
import Webcam from "react-webcam";
import {uploadImage} from '../../Api'
import '../../css/UploadImage.css'

export type ImageToUpload = {
	file: File,
	title: string,
	description: string,
	tags: string
}

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: "user"
};

const UploadPage = () =>  {
	const [imageDetails, setImageDetails] = useState<ImageToUpload>();
	const [imageTempUrl, setImageTempUrl] = useState<string>();
	
	const webcamRef = React.useRef(null);

	const capture = () => {
			// @ts-ignore
			const imageSrc = webcamRef.current.getScreenshot();
			urltoFile(imageSrc, 'webcam.png')
				.then((file: File) => {
					onImageSetCallback(file)
				})
		};

	const onDescriptionSetCallback = (description: string) => {
		let imgCopy :ImageToUpload = Object.assign({}, imageDetails);
		imgCopy.description = description;
		setImageDetails(imgCopy);
	};

	const onTagsSetCallback = (tags: string) => {
		let imgCopy :ImageToUpload = Object.assign({}, imageDetails);
		imgCopy.tags = tags;
		setImageDetails(imgCopy);
	};

	const onImageSetCallback = (file: File) => {
		let imgCopy :ImageToUpload = Object.assign({}, imageDetails);
		imgCopy.file = file;
		setImageDetails(imgCopy);
		let reader = new FileReader();
		reader.onload = (e) => {
			// @ts-ignore
			setImageTempUrl(e.target.result);
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	};

	const onTitleSetCallback = (title: string) => {
		let imgCopy :ImageToUpload = Object.assign({}, imageDetails);
		imgCopy.title = title;
		setImageDetails(imgCopy);
	};

	const urltoFile = (url: any, filename: any) => {
		const mimeType = (url.match(/^data:([^;]+);/)||'')[1];
		return (fetch(url)
				.then(function(res){return res.arrayBuffer();})
				.then(function(buf){return new File([buf], filename, {type:mimeType});})
		);
	};


	const upload = async () => {

		if (!imageDetails) {
			return;
		}
		if (imageDetails.file === undefined) {
			alert("Vous n'avez pas choisi d'image");
			return;
		}
		if (!imageDetails.title || imageDetails.title.length === 0 || !imageDetails.tags ||
			imageDetails.tags.length === 0 || !imageDetails.description ||
			imageDetails.description.length === 0)  {
			alert("Il manque des champs");
			return;
		}
		uploadImage(imageDetails).then((response) => {
			alert("Image téléversée avec succès !");
		}).catch((e) => {
			alert(e);
		});
	};

	return (
			<Container>
				<Jumbotron fluid style={{ marginTop: '10px' }}>
					<Container>
						<h1>Téléverser une image</h1>
						<p>
							Séléctionnez une image, ajoutez une description et des tags !
						</p>
					</Container>
				</Jumbotron>
				<Row>
					<Col lg={6}>
						<Container fluid>
							<h4>Séléctionnez votre image en la glissant ou en clickant sur la zone</h4>
							<DragNDropZone imageCallback={onImageSetCallback}/>
							<h4>Ou bien utilisez votre webcam</h4>
							<Webcam
								audio={false}
								height={300}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								width={"100%"}
								videoConstraints={videoConstraints}
							/>
							<Button onClick={capture}>Prendre une photo</Button>
						</Container>
					</Col>
					<Col lg={6}>
						<Container fluid>
							<AddImageDetails descriptionCallack={onDescriptionSetCallback} tagsCallback={onTagsSetCallback} titleCallback={onTitleSetCallback}/>
						</Container>
					</Col>
				</Row>
				{imageTempUrl == null ? null :
					(
						<Row id={"image-container"}>
							<img src={imageTempUrl}  alt=""/>

						</Row>
					)}

				<Row>
					<Col className='text-center'>
						<Button onClick={upload} type="submit" value="Submit" size={'lg'}>Submit</Button>
					</Col>
				</Row>
			</Container>
		)
};

export default UploadPage