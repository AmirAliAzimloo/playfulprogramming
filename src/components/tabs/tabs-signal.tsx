import { JSXNode } from "components/types";
import { signal } from "@preact/signals";
import { Tabs as InnerTabs, TabsItem as InnerTabsItem } from "./tabs";
import { useEffect } from "preact/hooks";

const LOCAL_STORAGE_KEY = "tabs-selection";

const selectedTabs = signal<Record<string, string>>({});

let loadLocalStorage = () => {
	loadLocalStorage = () => {};

	if (typeof localStorage === "undefined") {
		return;
	}

	const tabsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (!tabsJson) return;

	let tabs: unknown;
	try {
		tabs = JSON.parse(tabsJson);
	} catch (e) {
		return;
	}

	if (tabs && typeof tabs === "object") {
		selectedTabs.value = tabs as Record<string, string>;
	} else {
		return;
	}
}

interface TabInfo {
	slug: string;
	name: string;
}

interface TabsProps {
	id: string;
	tabs: TabInfo[];
	children: JSXNode;
}

export function Tabs({ id, tabs, children }: TabsProps) {
	const selectedTab = selectedTabs.value[id] ?? tabs[0]?.slug;

	useEffect(() => {
		loadLocalStorage();
	}, []);

	function setSelectedTab(tab: string) {
		const newSelectedTabs = {
			...selectedTabs.value,
			[id]: tab,
		};
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSelectedTabs));
		selectedTabs.value = newSelectedTabs;
	}

	return (
		<InnerTabs
			id={id}
			tabs={tabs}
			selectedTab={selectedTab}
			setSelectedTab={setSelectedTab}
		>
			{children}
		</InnerTabs>
	);
}

type TabsItemProps = TabsProps & {
	id: string;
	slug: string;
};

export function TabsItem({ id, tabs, slug, children }: TabsItemProps) {
	const selectedTab = selectedTabs.value[id] ?? tabs[0]?.slug;

	return (
		<InnerTabsItem
			id={id}
			tabs={tabs}
			slug={slug}
			selectedTab={selectedTab}
		>
			{children}
		</InnerTabsItem>
	);
}
