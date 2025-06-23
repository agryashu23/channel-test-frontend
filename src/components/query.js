import React, { useState, useEffect } from "react";
import { postRequestUnAuthenticated } from "./../services/rest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const QueryPage = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await postRequestUnAuthenticated(`/fetch/query`);
      setQueries(response.query);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleDeleteQuery = async (id) => {
    try {
      const response = await postRequestUnAuthenticated(`/delete/query`, {
        id: id,
      });
      setQueries(response.query);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <h2 className="text-theme-secondaryText mb-4 text-2xl mt-4">
        All Queries
      </h2>
      <div className="mt-5 w-full">
        {queries?.length === 0 ? (
          <p className="mt-20 text-theme-secondaryText text-xl text-center">
            No Feedbacks yet.
          </p>
        ) : (
          <ul>
            {queries?.map((query, index) => (
              <div className=" px-12 w-full">
                <div className="flex flex-row space-x-5 mt-2 justify-between items-center w-full px-8">
                  <div className="flex flex-col justify-start space-y-1 w-4/5">
                    <li
                      key={index}
                      className="text-theme-primaryText font-light text-xs"
                    >
                      {query.email}
                    </li>
                    <li
                      key={index}
                      className="text-theme-secondaryText font-normal w-full text-sm"
                    >
                      {query.text}
                    </li>
                    {query.images.length > 0 && (
                      <div className="flex flex-row space-x-3 overflow-x-auto custom-scrollbar w-full mt-4">
                        {query.images.map((file, index) => (
                          <div
                            key={index}
                            className="relative min-w-32 bg-gray-200 bg-theme-dark rounded-xl shadow-md overflow-hidden flex-shrink-0"
                          >
                            <img
                              src={file}
                              alt={`carousel-${index}`}
                              className="w-full h-32 object-cover rounded-t-xl"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => handleDeleteQuery(query._id)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
                <div className="border  border-theme-tertiaryBackground my-2"></div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QueryPage;
