import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { setLoading } from '../ReduxStore/UISlice';
import { RootState } from '../ReduxStore/store';
import { useSelector } from 'react-redux';
import { setAllUserData } from '../ReduxStore/UserSlice';

type HttpError = {
    message: string;
    status?: number;
};

function useUserProfileCall(url: string, options: object): [HttpError | null] {
    const [err, setErr] = useState<HttpError | null>(null);
    const dispatch = useDispatch();

    const token = useSelector((state: RootState) => state.User.token)

    useEffect(() => {
        const fetchData = async (token: string | null) => {
            // dispatch(setLoading(true));
            try {
                if (token !== null) {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        // dispatch(setLoading(false));
                        throw new Error('Request failed');
                    }
                    const jsonData = await response.json();
                    dispatch(setAllUserData(jsonData));
                    // dispatch(setLoading(false));
                    // console.log(jsonData)
                }
            } catch (err) {
                console.error('Error:', err);
                setErr({
                    message: (err as Error).message,
                });
                // dispatch(setLoading(false));
            }
        };

        fetchData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, token]);

    return [err];
}

export default useUserProfileCall;
