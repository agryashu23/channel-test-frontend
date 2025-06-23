import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import "./styles/Modals.css";

const SaveChip = ({ open, onClose }) => {
  const [isSavetoCuration, setIsSavetoCuration] = useState(false);
  if (!open) return null;

  const curations = [
    {
      name: "Margot Robbed with bangalore",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Margot Robbed",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Margot Robbed",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Margot Robbed",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Margot Robbed",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Dylan Garden",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Dylan Garden",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Dylan Garden",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Dylan Garden",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Dylan Garden",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
    {
      name: "Yash Kalra",
      image:
        "https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg",
      username: "Yashu Agrawal",
    },
  ];

  const handleCloseChange = () => {
    setIsSavetoCuration(false);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-chipBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-1/4">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  Save Chip
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleCloseChange}
                />
              </div>
              {isSavetoCuration ? (
                <div>
                  <div className="flex flex-row items-center">
                    <div className="w-5 h-5 rounded-full bg-primary text-chipBackground text-md flex items-center justify-center">
                      +
                    </div>
                    <p className="font-inter ml-2 text-sm text-primary font-light">
                      Save in new curation
                    </p>
                  </div>
                  <p className="text-neutral-50 text-sm mt-5 font-light font-inter">
                    Add to your curation
                  </p>
                  {/* <div className="relative mt-2 w-full">
                    <FontAwesomeIcon icon={faSearch} className="absolute top-1/2 ml-3 transform -translate-y-1/2 text-textFieldColor w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-3 py-3 rounded-xl bg text-white placeholder-textFieldColor placeholder:font-light focus:outline-none w-full font-inter font-normal"
                      style={{ fontSize: '15px' }}
                    />
                  </div> */}
                  <div className="mt-5 overflow-y-auto h-64 flex flex-col space-y-2 custom-scrollbar">
                    {curations.map((curation, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex flex-row items-center">
                          <img
                            src={curation.image}
                            alt={curation.name}
                            className="rounded-lg h-12 w-16"
                          />
                          <p className="ml-2 font-inter font-light text-sm text-textColor">
                            {curation.name}
                          </p>
                        </div>
                        <div className="w-full mt-2 h-[0px] border border-[#36343b]"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mt-1 text-sm text-profileText font-light font-inter">
                    Save your chip to your profile and let your creativity flow
                    towards the world
                  </p>
                  <button className="w-full mt-4 bg-primary text-buttonText py-2.5 font-normal text-sm rounded-full">
                    Save chip
                  </button>
                  <button
                    onClick={() => setIsSavetoCuration(true)}
                    className="w-full mt-4 mb-2 text-primary font-normal text-sm rounded-full"
                  >
                    Save to curation
                  </button>
                </div>
              )}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SaveChip;
