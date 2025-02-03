import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@/types";

export function RestaurantInfoPopover({ restaurant }: Readonly<{ restaurant: Restaurant}>) {

  const infoItems = [
    {
      value: restaurant.OperatingCompany,
      label: "Название управляющей компании",
    },
    {
      value: restaurant.Address,
      label: "Адрес",
    },
    {
      value: restaurant.SeatsCount,
      label: "Число посадочных мест",
    },
  ];

  return (
    <Card className={"w-[350px] justify-self-center p-[1.125rem] space-y-4"}>
      <CardHeader className={"flex !space-y-0 p-0"}>
        <CardTitle className={"text-base font-medium"}>{restaurant.Name}</CardTitle>
        <CardDescription className={"leading-4"}>{restaurant.TypeObject}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        {infoItems
        .filter((item) => item.value)
        .map((item) => (
          <div
          className="grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          key={item.label}
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-color-indicator-info" />
            <div className="!space-y-0">
              <p className="text-[0.875rem] leading-[1rem] !m-0">
                {item.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}