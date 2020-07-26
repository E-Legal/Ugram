
import React, { useRef, useEffect } from "react";
import '../../css/search.css';
import { InputGroup, DropdownButton, Dropdown, Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Typeahead } from 'react-bootstrap-typeahead';
import { getPopularTags } from '../../Api'
import cookie from 'react-cookies';

export type SearchOptions = {
    input: string,
    tag: string
}

const popularsTags: any[] = [];

const tags = ["Description", "Utilisateurs", "Hashtag"];

const SearchBar = () => {
    const [searchOptions, setSearchOptions] = React.useState<SearchOptions>({
        input: "",
        tag: tags[0]
    });

    const history = useHistory();
    const inputRef: any = useRef(null);

    useEffect(() => {
        const isLoggedIn = (cookie.load("id") === undefined ? false : true);
        if (isLoggedIn) {
            getPopularTags().then((response) => {
                response.data.forEach((element: any) => {
                    popularsTags.push(element.name)
                });
            })
                .catch((error) => {
                    alert(error.response.data);
                })
        }
    }, []);

    const onDropwownSelect = (eventKey: any) => {
        const newSearchOptions = { ...searchOptions };
        newSearchOptions.tag = eventKey;
        setSearchOptions(newSearchOptions);
    };


    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!searchOptions.input)
            alert("Le champ de recherche est vide.")
        else {
            history.push(`/search/${searchOptions.tag}/${searchOptions.input}`, {
                searchOptions
            });
            window.location.reload();
        }
    };

    const handleInputChange = (input: any, e: any) => {
        const newSearchOptions = { ...searchOptions };
        if (inputRef.current) {
            newSearchOptions.input = input;
        }
        setSearchOptions(newSearchOptions);
    }

    const handleChange = (selectedOptions: any) => {
        history.push(`/search/${searchOptions.tag}/${selectedOptions[0]}`, {
            searchOptions
        });
        window.location.reload();
    }

    return (
        <Form noValidate onSubmit={handleSubmit}>
            <InputGroup style={{ marginLeft: "10px", display: "flex", flex: 1 }}>
                <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title={searchOptions.tag}
                    id="input-group-dropdown-1"
                    onSelect={onDropwownSelect} >
                    {tags.map((value, index) => {
                        return <Dropdown.Item eventKey={value} key={index} href="#">{value}</Dropdown.Item>
                    })}
                </DropdownButton>
                <Typeahead
                    id="id"
                    aria-describedby="basic-addon1"
                    placeholder="Rechercher"
                    minLength={1}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    ref={inputRef}
                    options={popularsTags}
                />
                <InputGroup.Append>
                    <Button type="submit" variant="outline-secondary">Rechercher</Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    )
};

export default SearchBar;