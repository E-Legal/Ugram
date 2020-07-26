import React, { useEffect, useState } from 'react';
import { SearchOptions } from '../component/Search/SearchBar'
import { useParams } from "react-router";
import { getSearch } from '../Api'
import '../css/search.css'
import { profilInfos } from "../component/profile_components/Profil";
import UserProfileCard from "../component/profile_components/SearchProfilCard";
import Select from 'react-select';
import { ImageInfos } from "../component/Image";
import ImageComponent from "../component/Image";

type selectOptions = {
    value: string,
    label: string
}
const selectOpt: selectOptions[] = [
    { value: 'date', label: 'Date' }
];

const SearchResults = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [isResultsEmpty, setisResultsEmpty] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const options = useParams<SearchOptions>();


    const onChange = (event: any) => {
        if (options.tag !== "Utilisateurs") {
            if (event.value === 'date') {
                sortByDate();
            } else if (event.value === 'owner') {
                sortByName();
            }
        }
    };

    const sortByName = () => {
        const resCopy = [...searchResults];
        resCopy.sort((a: ImageInfos, b: ImageInfos) => a.owner_id.localeCompare(b.owner_id));
        setSearchResults(resCopy)
    };

    const sortByDate = () => {
        const resCopy = [...searchResults];
        resCopy.sort((a: ImageInfos, b: ImageInfos) => {
            const dateA: Date = new Date(a.createdAt);
            const dateB: Date = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
        });
        setSearchResults(resCopy);
    };

    useEffect(() => {
        getSearch(options.tag, options.input).then((response) => {
            setSearchResults(response.data);
            setLoading(false);
            if (response.data.length <= 0)
                setisResultsEmpty(true);
        })
    }, [options.input, options.tag]);

    const renderLoading = () => {
        return (
            <div id="results-container">
                Recherche en cours ...
            </div>
        )
    };

    const renderAfterFetch = () => {
        return (
            <div id="results-container">
                {isResultsEmpty ? "Pas de resultat." : renderResults()}
            </div>
        )
    };

    const renderResults = () => {
        if (options.tag === "Utilisateurs") {
            return (
                <div id="results-container">
                    {
                        searchResults.map((user: profilInfos, index) => <UserProfileCard
                            key={index} {...user} />)
                    }
                </div>
            )
        }
        else
            return (
                <div id="results-container-centered">
                    {searchResults.map((img: ImageInfos, index) => {
                        img.test = img.key;
                        return (<ImageComponent
                            key={index} {...img} />)
                    })}
                </div>
            )
    };

    return (
        <div>
            <h2>Filtrer vos recherches:</h2>
            <Select
                options={selectOpt}
                onChange={onChange}
                id="search-select"
            />
            {loading ? renderLoading() : renderAfterFetch()}
        </div>
    )
};

export default SearchResults;