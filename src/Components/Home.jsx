import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "../index.css";
import { Paginate } from "./Paginate.jsx";
import Pages from "./Pages.jsx";


const Home = () => {
    const pageSize = 10;
    const [apiImage, setApiImage] = useState([]);
    const [current, Ucurrent] = useState(1);
    const [apiImages, setApiImages] = useState();
    const [inputData, setInputData] = useState({});
    const [allImages, setAllImages] = useState();
    const [search, setSearch] = useState(false)

    const handleChange = ({ currentTarget: input }) => {
        const InputData = { ...inputData }
        InputData[input.name] = input.value;
        setInputData(InputData)
        if (inputData.query === "") {
            setSearch(false)
        } else {
            setSearch(true)
        }
    }

    const handleSubmit = () => {

    }

    useEffect(() => {
        const getData = async () => {
            const { data: Image } = await axios.get('https://api.nasa.gov/planetary/apod?api_key=w8t3VEmtG5BV9r4rklslFqRr8NxGueY0wT8o1Jx9');
            const { data: Images } = await axios.get(`https://images-api.nasa.gov/search?q=${inputData.query ? inputData.query : "moon"}`)
            setApiImages(Paginate(Images.collection.items, current, pageSize))
            setAllImages(Images.collection.items)
            setApiImage([Image])
        }
        getData()
    }, [inputData.query, current])

    const pageChange = (page) => {
        Ucurrent(page);
    };
    return (
        <>


            <div id="container" >
                {apiImage.map((value) =>
                    <>
                        <div id="searchBar">
                            <h4 style={{ display: "inline-block" }} ><strong>{value.title.trim()}</strong><sub>#PIc-Of-The-Day</sub></h4>
                            <form style={{ display: "inline-block", float: "right" }} class="form-inline my-2 my-lg-0">
                                <input value={inputData.query} name="query" onChange={handleChange} class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                <button onClick={handleSubmit} class="btn btn-outline-success my-2 my-sm-0" type="button">Search</button>
                            </form>
                        </div>
                        {!inputData.query &&
                            <>
                                <div id="image">
                                    <img src={value.url} alt="Pic-Of-The-Day" />
                                </div>
                                <div id="discription">
                                    <p style={{textAlign:"justify"}}><strong>Explanation:</strong> {value.explanation}</p>
                                    <p><strong>Date:</strong> {value.date}</p>
                                    <p id="footer"><strong>©</strong>{value.copyright}</p>
                                </div>
                            </>
                        }
                    </>)
                }
                <div id="container2">
                    {search &&
                        apiImages.filter((x) => x.links !== undefined).map((v) =>
                            <>
                                <div id="images">
                                    <img alt="result" src={v.links[0].href} />
                                    <p id="p1"><strong>Title:</strong>{v.data[0].title}</p>
                                    <p id="p2"><strong>Date Created:</strong>{v.data[0].date_created}</p>
                                </div>
                            </>
                        )
                    }

                </div>
                {search &&
                    <div id="container3">
                        <Pages
                            count={allImages.length}
                            pageSize={pageSize}
                            onpageChange={pageChange}
                            currentPage={current}
                        />
                    </div>
                }
                <div id="container5">
                {search && <h4>Related Results</h4>}
                <div id="searchReasult">
                {search &&
                    apiImages.filter((x) => x.data[0].title.toLowerCase().includes(inputData.query.toLowerCase())).map((v) =>
                        <p><a href="#">{v.data[0].title}</a></p>
                    )
                    }
                </div>
                </div>
            </div>

        </>
    );
}

export default Home;



