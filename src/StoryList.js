import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import 추가
import './StoryList.css'; // 스타일 파일 임포트
import axios from 'axios'; // axios를 import하여 API 요청 사용

const StoryList = () => {
    const [responseList, setResponseList] = useState([]); // 변수 이름을 stories로 수정
    const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동

    const fetchList = async () => {
        try {
            const response = await axios.get('http://localhost:8080/story/list'); // API 요청
            setResponseList(response.data);
        } catch (error) {
            console.error("There was an error", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // 스토리 추가 버튼 클릭 시 StoryAddForm으로 이동하는 함수
    const handleAddStory = () => {
        navigate('/story/form/add'); // StoryAddForm 페이지로 이동
    };

    return (
        <div className="story-list">
            <h2>Story List</h2>
            <button className="add-story-button" onClick={handleAddStory}>스토리 추가</button> {/* 스토리 추가 버튼 */}
            <ul>
                {Array.isArray(responseList) && responseList.map((map) => (
                    <li key={map.story.id} className="story-card">
                        <div className="story-header">
                            <p className="nickname">{map.story.user ? map.story.user.nickname : '익명'}</p>
                            <button className="share-button">{map.story.share ? '공유됨' : '공유하기'}</button>
                        </div>
                        {map.mainPhoto && (
                            <Link to={`/story/view/${map.story.id}`}>
                                <div className="image-container">
                                    <img src={`/images${map.mainPhoto.path}`} alt={map.story.title} />
                                </div>
                            </Link>
                        )}
                        <div className="story-info">
                            <div className="like-info">
                                <button className="like-button">좋아요</button>
                                <span>{map.likeCount}</span>
                            </div>
                            <Link to={`/story/view/${map.story.id}`}>{map.story.title}</Link>
                            <Link to={`/story/view/${map.story.id}`}>
                                <p>{map.story.content}</p>
                            </Link>
                            <div className="location-date">
                                <p>{map.story.location.firstName} {map.story.locationDetail}</p>
                                <p>{map.story.travelDate}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StoryList;