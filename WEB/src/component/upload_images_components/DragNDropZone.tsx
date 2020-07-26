import React, {useCallback, useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import { useDropzone } from 'react-dropzone';

const DragNDropZone = ({imageCallback} :any) => {
	const [file, setFile] = useState<File>();

	const onDrop = useCallback(acceptedFiles => {
		setFile(acceptedFiles[0]);
	}, []);

	useEffect( () => {
	}, []);

	useEffect(() => {
		imageCallback(file);
		// eslint-disable-next-line
	}, [file]);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({onDrop});

	const files = acceptedFiles.map( (file, index) => (
		<div key={index}>
			<Image src={(file as any).path}/>
			{(file as any).path} - {file.size} bytes
    </div>
	));

	return (
		<section className="container">
			<Container {...getRootProps({ className: 'dropzone' })} style={{ backgroundColor: "#e4e6eb", border: '1px dashed #000000' }}>
				<Image src={require('../../assets/drag_n_drop_icon.png')} className="mx-auto d-block" style={{ height: '128px', width: '128px', margin: "10px" }} />
				<input {...getInputProps()} />
			</Container>
			<aside>
				<h5>Image</h5>
				<ul>
					{files}
				</ul>
			</aside>
		</section>
	);
}

export default DragNDropZone
