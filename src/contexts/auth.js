import React, { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import firebase, { db } from "services/firebase";
import { useMounted } from "hooks";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState({
        isUserLoggedIn: false,
        user: null,
    });
    const [userName, setUserName] = useState("");
    const mounted = useMounted();

    useEffect(() => {
        const uid = userInfo.user?.uid || "EMPTY";

        db.collection("users")
            .doc(uid)
            .get()
            .then((doc) => {
                if (doc.exists || uid === "EMPTY") {
                    return;
                }

                db.collection("users").doc(uid).set({
                    email: userInfo.user.email,
                    name: userInfo.user.displayName,
                    role: "user",
                });
            })
            .catch(() => {});
    }, [userInfo]);

    const upgradeUserName = useCallback(() => {
        const uid = userInfo.user?.uid || "EMPTY";

        db.collection("users")
            .doc(uid)
            .get()
            .then((doc) => {
                if (!mounted.current) {
                    return;
                }
                if (doc.exists && uid !== "EMPTY") {
                    setUserName(doc.data().name);
                }
            })
            .catch(() => {});
    }, [mounted, userInfo]);

    useEffect(() => {
        upgradeUserName();
    }, [upgradeUserName]);

    const createAccount = useCallback(
        (displayName, email, password) => {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async (userCredential) => {
                    var user = userCredential.user;
                    db.collection("users").doc(user.uid).set({
                        email: email,
                        name: displayName,
                        role: "user",
                    });

                    await upgradeUserName();
                })
                .catch((error) => {
                    if (
                        error.message ===
                        "The email address is already in use by another account."
                    )
                        alert("Erro ao criar a conta, email já está em uso!");
                });
        },
        [upgradeUserName]
    );

    const login = useCallback((email, password) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                setUserInfo(userCredential.user);
            })
            .catch((e) => {
                if (e.code === "auth/user-not-found")
                    return alert("Email não cadastrado");

                if (e.code === "auth/wrong-password") {
                    return alert(
                        `Email ou senha incorretos. Tente novamente ou clique em "Esqueceu sua senha?"`
                    );
                } else {
                    return alert(
                        `Email ou senha incorretos. Tente novamente ou clique em "Esqueceu sua senha?"`
                    );
                }
            });
    }, []);

    const facebookLogin = useCallback(() => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }, []);

    const googleLogin = useCallback(() => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }, []);

    const logout = useCallback(() => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                setUserInfo({ isUserLoggedIn: false, user: null });
            });
    }, []);

    const forgoutPassword = useCallback(async (email) => {
        const result = await firebase
            .auth()
            .fetchSignInMethodsForEmail(email)
            .then((signInMethods) => {
                if (signInMethods.length) {
                    if (signInMethods[0] === "password") {
                        firebase
                            .auth()
                            .sendPasswordResetEmail(email)
                            .then(() => {
                                return false;
                            })
                            .catch(() => {
                                return true;
                            });
                    } else {
                        return true;
                    }
                }
            })
            .catch(() => {
                return true;
            });

        return result;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                createAccount,
                login,
                facebookLogin,
                googleLogin,
                logout,
                forgoutPassword,
                userInfo,
                userName,
                setUserInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider, AuthContext };
