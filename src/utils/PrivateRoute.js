import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function PrivateRoute({ component: Component, ...rest }) {
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    return (
        
            <Route
                {...rest}
                render={props =>
                    sessionStorage.getItem('member') != null ?
                        (<Component {...props} />
                            ) : (
                            <Redirect to={{
                                pathname: '/',
                                state: { from: props.location },
                            }}
                            />

                        )
                }
            />



    )
}

export default PrivateRoute;