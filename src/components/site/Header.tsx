import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, User, X, Zap } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { RfqDialog } from "./RfqDialog";

const NAV: { label: string; href: string }[] = [
{ label: "Search Parts", href: "/parts" },
{ label: "Categories", href: "/#catalog" },
{ label: "Featured", href: "/#featured" },
{ label: "Services", href: "/#services" },
{ label: "How it Works", href: "/#how" },
{ label: "Contact", href: "/#footer" },
];

export function Header() {
const [scrolled, setScrolled] = useState(false);
const [open, setOpen] = useState(false);
const [bell, setBell] = useState(false);
const [rfqOpen, setRfqOpen] = useState(false);

useEffect(() => {
const onScroll = () => setScrolled(window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
