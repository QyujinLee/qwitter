import Qweet from "components/Qweet";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [qweet, setQweet] = useState("");
    const [qweets, setQweets] = useState([]);
    const [attachment, setAttachment] = useState();

    // 아래와 같은 방법은 오래된 데이터를 가져온다
    // const getQweets = async () => {
    //     const dbQweets = await dbService.collection("qweets").get();
    //     dbQweets.forEach((document) => {
    //         const qweetObj = {
    //             ...document.data(),
    //             id: document.id,
    //         };
    //         setQweets((prev) => [qweetObj, ...prev]);
    //     });
    // };

    useEffect(() => {
        dbService
            .collection("qweets")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const qweetArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQweets(qweetArray);
            });
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(
                attachment,
                "data_url"
            );
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const qweetObj = {
            text: qweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("qweets").add(qweetObj);
        setQweet("");
        setAttachment("");
    };

    const onChange = (e) => {
        const {
            target: { value },
        } = e;

        setQweet(value);
    };

    const onFileChange = (e) => {
        const {
            target: { files },
        } = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null);

    return (
        <div>
            <form>
                <input
                    type="text"
                    placeholder="What's on your mind ?"
                    maxLength={120}
                    value={qweet}
                    onChange={onChange}
                />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Qweet" onClick={onSubmit} />
                {attachment && (
                    <div>
                        <img
                            src={attachment}
                            width="50px"
                            height="50px"
                            alt={qweet.id}
                        />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {qweets.map((qweet) => (
                    <Qweet
                        key={qweet.id}
                        qweetObj={qweet}
                        isOwner={userObj.uid === qweet.creatorId}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
