import { authService, firebaseInstatance } from "fbase";
import React, { useState } from "react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    // 이메일 및 비밀번호 변경 시 이벤트
    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    // 계정 생성 또는 로그인 버튼 이벤트
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            let data;
            if (newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password
                );
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(
                    email,
                    password
                );
            }

            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // 계정 생성 및 로그인 상태값 변화 토글
    const toggleAccount = () => {
        setNewAccount((prev) => !prev);
    };

    // 깃헙, 구글 로그인 클릭 이벤트
    const onSocialClick = async (e) => {
        const {
            target: { name },
        } = e;
        let provider;

        if (name === "google") {
            provider = new firebaseInstatance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstatance.auth.GithubAuthProvider();
        }

        const data = await authService.signInWithPopup(provider);

        console.log(data);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                    required
                />
                <input
                    type="submit"
                    value={newAccount ? "Create Account" : "Sign In"}
                />
                {error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Accout"}
            </span>
            <div>
                <button name="google" onClick={onSocialClick}>
                    Continue with Google
                </button>
                <button name="github" onClick={onSocialClick}>
                    Continue with Github
                </button>
            </div>
        </div>
    );
};

export default Auth;
