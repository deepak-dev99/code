import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // adjust path as needed

export default function TabsHeader({
  tabs = [],
  value,
  onChange,
  className = "",
  tabsListClass = "",
}) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      defaultValue={tabs[0]?.value}
      className={`w-full md:w-[400px] ${className}`}
    >
      <TabsList
        className={`
          w-full 
          flex 
          flex-wrap 
          justify-start 
          md:justify-center 
          gap-2 
          overflow-x-auto 
          scrollbar-none
          ${tabsListClass}
        `}
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
