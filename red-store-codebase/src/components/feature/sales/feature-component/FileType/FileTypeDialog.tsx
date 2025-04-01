import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PiFileCsvDuotone, PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImFilesEmpty } from "react-icons/im";
import { Calendar } from "@/components/ui/calendar";
import * as React from "react";
import axios from "axios";

interface FileTypeDialogProps {
  storeId?: number;
}

export function FileTypeDialog({ storeId }: FileTypeDialogProps) {
  const [options, setOptions] = React.useState<
    { year: number; month: number }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedFileType, setSelectedFileType] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [downloadType, setDownloadType] = React.useState("month");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  React.useEffect(() => {
    const fetchMonths = async () => {
      if (!storeId) return;
      try {
        const { data } = await axios.get(
          "/api/inventory/timeseries/metrics/get-month-year",
          { params: { store_id: storeId } }
        );
        setOptions(data);
      } catch (error) {
        console.error("Error fetching month data:", error);
      }
    };
    fetchMonths();
  }, [storeId]);

  const handleDownload = async () => {
    if (
      !selectedFileType ||
      (downloadType === "month" && !selectedMonth) ||
      (downloadType === "day" && !selectedDate)
    ) {
      alert("Please select a file type and a valid date.");
      return;
    }

    setIsLoading(true);

    try {
      // Use the correct API endpoint
      const apiUrl = "/api/inventory/timeseries/metrics/report-gen";

      // Set up query parameters
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        store_id: storeId,
        file_type: selectedFileType,
      };

      // Add date parameters based on selection type
      if (downloadType === "month") {
        const [year, month] = selectedMonth.split("-");
        params.month_input = `${year}-${String(month).padStart(2, "0")}-01`;
      } else {
        params.date_input = selectedDate
          ? `${selectedDate.getFullYear()}-${String(
              selectedDate.getMonth() + 1
            ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
              2,
              "0"
            )}`
          : "";
      }

      // Make the API request
      const { data } = await axios.get(apiUrl, {
        params,
        responseType: "json",
      });

      // Handle the response based on file type
      if (data) {
        let fileName = `inventory-report-${selectedFileType}`;

        // Add date information to filename
        if (downloadType === "month") {
          const [year, month] = selectedMonth.split("-");
          fileName += `-${year}-${month}`;
        } else {
          fileName += selectedDate
            ? `-${selectedDate.getFullYear()}-${String(
                selectedDate.getMonth() + 1
              ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                2,
                "0"
              )}`
            : "";
        }

        // Handle the download based on file type
        const downloadFile = (dataUrl: string, filename: string) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        if (selectedFileType === "pdf" && data.pdf) {
          // PDF comes back as a data URI
          downloadFile(data.pdf, `${fileName}.pdf`);
        } else if (selectedFileType === "excel" && data.excel) {
          // Excel comes back as base64
          downloadFile(
            `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data.excel}`,
            `${fileName}.xlsx`
          );
        } else if (selectedFileType === "csv" && data.csv) {
          // CSV comes back as base64
          downloadFile(`data:text/csv;base64,${data.csv}`, `${fileName}.csv`);
        } else {
          alert("Failed to generate the file. Please try again.");
        }
      } else {
        alert("No data received from the server");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("An error occurred while downloading the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <div className="flex items-center">
            <ImFilesEmpty className="mr-2 h-3 w-3" />
            <p>Download</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Select File Type</DialogTitle>
          <DialogDescription>
            Choose the file type and date range for the report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex gap-3 items-center">
            <Button
              variant={"secondary"}
              className={
                selectedFileType === "pdf" ? "bg-blue-100 text-blue-600" : ""
              }
              onClick={() => setSelectedFileType("pdf")}
            >
              <BsFileEarmarkPdf className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button
              variant={"secondary"}
              className={
                selectedFileType === "excel" ? "bg-blue-100 text-blue-600" : ""
              }
              onClick={() => setSelectedFileType("excel")}
            >
              <PiMicrosoftExcelLogoFill className="mr-2 h-4 w-4" /> Excel
            </Button>
            <Button
              variant={"secondary"}
              className={
                selectedFileType === "csv" ? "bg-blue-100 text-blue-600" : ""
              }
              onClick={() => setSelectedFileType("csv")}
            >
              <PiFileCsvDuotone className="mr-2 h-4 w-4" /> CSV
            </Button>
          </div>
          <div className="flex flex-row gap-3 text-sm">
            <button
              onClick={() => setDownloadType("month")}
              className={`px-3 py-1 border rounded-md transition-all  ${
                downloadType === "month"
                  ? "bg-yellow-100 text-yellow-600 border-yellow-600"
                  : "border-gray-600"
              }`}
            >
              {`Month ( mm/yy )`}
            </button>
            <button
              onClick={() => setDownloadType("day")}
              className={`px-3 py-1 border rounded-md transition-all  ${
                downloadType === "day"
                  ? "bg-yellow-100 text-yellow-600 border-yellow-600"
                  : "border-gray-600"
              }`}
            >
              {`Day ( dd/mm/yy )`}
            </button>
          </div>
          {downloadType === "month" ? (
            <Select onValueChange={(value) => setSelectedMonth(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Months</SelectLabel>
                  {options.map((option) => (
                    <SelectItem
                      key={`${option.year}-${option.month}`}
                      value={`${option.year}-${option.month}`}
                    >
                      {`${monthNames[option.month - 1]} ${option.year}`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} disabled={isLoading}>
            {isLoading ? "Downloading..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
