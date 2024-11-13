import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import 추가
// import './ShareStoryList.css'; // 스타일 파일 임포트
import axios from 'axios'; // axios를 import하여 API 요청 사용
import StoryItemList from "../components/StoryItemList";
import AlarmCardList from "../components/AlarmCardList";
import Profile from "../components/Profile";
import ShareStoryView from './ShareStoryView.js';
import useModals from '../useModals';
import { modals } from '../components/Modals';


const MyPage = () => {
    const [storyList, setStoryList] = useState([]); // 변수 이름을 stories로 수정
    const [alarmListDTOs, setAlarmListDTOs] = useState([]);
    const [user, setUser] = useState([]);
    const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동
    const [batchedLikes, setBatchedLikes] = useState([]);
    const [batchedLocks, setBatchedLocks] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const { openModal } = useModals();



    // 로컬 스토리지에서 accessToken을 가져오는 함수
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            console.warn("Access token이 없습니다.");
        }
    }, [accessToken]);


    // accessToken이 설정된 경우에만 호출
    useEffect(() => {
        if (accessToken) {
            const fetchStoryList = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/like/list/my-stories', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }); // API 요청
                    setStoryList(response.data);
                } catch (error) {
                    console.error("좋아요한 스토리 불러오기 실패!", error);
                }
            };
            fetchStoryList();
        }
    }, [accessToken]);


    // 로그인한 사용자 정보를 불러올수도 있고 아닐수도 있고 그럴수도 있고
    useEffect(() => {
        if (accessToken) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/user/finduser', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }); // API 요청
                    setUser(response.data);
                } catch (error) {
                    console.error("사용자 정보 불러오기 실패", error);
                }
            };
            fetchUser();
        }
    }, [accessToken]);

    // 로그인한 사용자의 스토리에 좋아요를 누른 유저의 리스트 불러오기
    useEffect(() => {
        if (accessToken) {
            const fetchAlarmListDTOs = async () => {
                try {
                    const response2 = await axios.get('http://localhost:8080/like/list/users', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    setAlarmListDTOs(response2.data);
                } catch (error) {
                    console.error("오류가 발생했습니다!", error);
                }
            };
            fetchAlarmListDTOs();
        }
    }, [accessToken]);

    // StoryItemList에서 모아둔 like 변경 사항을 저장하는 함수
    const handleBatchedLikesChange = (newBatchedLikes) => {
        setBatchedLikes(newBatchedLikes);
    };

    // 페이지 이동이나 새로고침 시, 서버에 좋아요 변경 사항 전송
    const handleSubmitLikes = async () => {
        if (batchedLikes.length === 0) return;

        try {
            console.log(batchedLikes);
            await axios.post('http://localhost:8080/like/batch-update', batchedLikes, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setBatchedLikes([]); // 전송 후 초기화
        } catch (error) {
            console.error("좋아요 변경 사항 전송 중 에러 발생", error);
        }
    };

    useEffect(() => {
        // 페이지 새로고침 시 전송
        window.addEventListener('beforeunload', handleSubmitLikes);

        // 페이지 이동 시 전송
        const unlisten = navigate((location) => {
            handleSubmitLikes();
        });
        return () => {
            window.removeEventListener('beforeunload', handleSubmitLikes);
            handleSubmitLikes(); // 컴포넌트 언마운트 시에도 전송
        };
    }, [batchedLikes]);


    // StoryItemList에서 모아둔 Lock 변경 사항을 저장하는 함수
    const handleBatchedLocksChange = (newBatchedLocks) => {
        setBatchedLocks(newBatchedLocks);
    };

    // 페이지 이동이나 새로고침 시, 서버에 공유 변경 사항 전송
    const handleSubmitLocks = async () => {
        if (batchedLocks.length === 0) return;

        try {
            console.log(batchedLocks);
            await axios.post('http://localhost:8080/story/batch-update', batchedLocks, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setBatchedLocks([]); // 전송 후 초기화
        } catch (error) {
            console.error("공유 변경 사항 전송 중 에러 발생", error);
        }
    };

    useEffect(() => {
        // 페이지 새로고침 시 전송
        window.addEventListener('beforeunload', handleSubmitLocks);

        // 페이지 이동 시 전송
        const unlisten = navigate((location) => {
            handleSubmitLocks();
        });
        return () => {
            window.removeEventListener('beforeunload', handleSubmitLocks);
            handleSubmitLocks(); // 컴포넌트 언마운트 시에도 전송
        };
    }, [batchedLocks]);


    const confirmView = async (storyId, otherUserId) => {
        try {
            // storyId와 otherUserId를 URL 파라미터로 포함하여 GET 요청
            await axios.get(`http://localhost:8080/like/confirm/${storyId}/${otherUserId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // 알림 목록을 다시 불러옵니다.
            const response = await axios.get('http://localhost:8080/like/list/users', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setAlarmListDTOs(response.data);  // 알림 목록 상태 업데이트
        } catch (error) {
            console.error("알림 확인 중 에러 발생", error);
        }
    };


    // 스토리 조회 모달
    const openStoryModal = (storyId) => {
        const content = <ShareStoryView storyId={storyId} />
        openModal(modals.modalSidebarRight, {
            onSubmit: () => {
                console.log('비지니스 로직 처리...2');
            },
            content
        });
    };


    return (
        <>
            <h1>프로필</h1>
            <Profile loginUser={user} />
            <h2>좋아요한 스토리</h2>
            <StoryItemList
                storyList={storyList}
                onBatchedLikesChange={handleBatchedLikesChange}
                onBatchedLocksChange={handleBatchedLocksChange}
                handleModal={openStoryModal}
            />

            <h3>알림</h3>
            <AlarmCardList
                alarmListDTOs={alarmListDTOs}
                confirmView={confirmView}
            />
        </>
    );
};

export default MyPage;
