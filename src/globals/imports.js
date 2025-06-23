import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/icons/channels_logo.svg";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useModal from "../components/hooks/ModalHook";
import Footer from "../components/Footer/Footer";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
  postRequestAuthenticatedWithFile,
  postRequestUnAuthenticatedWithFile,
} from "../services/rest";
import { hostUrl } from "../utils/globals";
import { isEmbeddedOrExternal } from "./../services/rest";

export {
  React,
  useState,
  useEffect,
  useRef,
  Logo,
  useNavigate,
  useDispatch,
  useSelector,
  useParams,
  useModal,
  Footer,
  useLocation,
  postRequestAuthenticated,
  postRequestUnAuthenticated,
  useSearchParams,
  postRequestAuthenticatedWithFile,
  postRequestUnAuthenticatedWithFile,
  hostUrl,
  isEmbeddedOrExternal,
};

//  import {
//    React,
//    useState,
//    useEffect,
//    useRef,
//    Logo,
//    useNavigate,
//    useDispatch,
//    useSelector,
//    useParams,
//    useModal,
//    Footer,
//    useLocation,
//    useSearchParams,
//    postRequestAuthenticated,
//    postRequestUnAuthenticated,
//    postRequestAuthenticatedWithFile,
//    postRequestUnAuthenticatedWithFile,
//    hostUrl,
//    isEmbeddedOrExternal
//  } from "../../globals/imports";
