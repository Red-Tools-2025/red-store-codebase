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
import * as React from "react";
import axios from "axios"; // Import Axios

interface FileTypeDialogProps {
  storeId?: number; // Required prop from the parent
}

export function FileTypeDialog({ storeId }: FileTypeDialogProps) {
  const [options, setOptions] = React.useState<
    { year: number; month: number }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedFileType, setSelectedFileType] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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

  // Fetch available months and years from API
  React.useEffect(() => {
    const fetchMonths = async () => {
      if (!storeId) {
        console.error("storeId is not available.");
        return;
      }

      try {
        const { data } = await axios.get<{ year: number; month: number }[]>(
          "/api/inventory/timeseries/metrics/get-month-year",
          {
            params: { store_id: storeId },
          }
        );
        setOptions(data);
      } catch (error) {
        console.error("Error fetching month data:", error);
      }
    };

    fetchMonths();
  }, [storeId]);

  const handleDownload = async () => {
    if (!selectedMonth || !selectedFileType) {
      alert("Please select both a file type and a month.");
      return;
    }

    setIsLoading(true);

    const apiEndpoints: { [key: string]: string } = {
      excel: "/api/inventory/timeseries/metrics/report-excel",
      pdf: "/api/inventory/timeseries/metrics/report-pdf",
      csv: "/api/inventory/timeseries/metrics/report-csv",
    };

    const [year, month] = selectedMonth.split("-");
    const apiUrl = `${apiEndpoints[selectedFileType]}?store_id=${storeId}&month_input=${year}-${month}-01`;

    try {
      const { data } = await axios.get<{
        excel?: string;
        pdf?: string;
        csv?: string;
      }>(apiUrl);

      let base64String = "";

      if (selectedFileType === "excel" && data.excel) {
        base64String = data.excel;
      } else if (selectedFileType === "pdf" && data.pdf) {
        base64String = data.pdf.split(",")[1] || data.pdf;
      } else if (selectedFileType === "csv" && data.csv) {
        base64String = data.csv;
      } else {
        alert("Failed to generate the file. Please try again.");
        return;
      }

      const binaryData = atob(base64String);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([byteArray], {
        type: getFileMimeType(selectedFileType),
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `report-${selectedFileType}-${year}-${month}.${
        selectedFileType === "excel" ? "xlsx" : selectedFileType
      }`;
      link.click();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error downloading file:", error);
      alert("An error occurred while downloading the file. Please try again.");
    }
  };

  const getFileMimeType = (fileType: string) => {
    switch (fileType) {
      case "excel":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "pdf":
        return "application/pdf";
      case "csv":
        return "text/csv";
      default:
        return "application/octet-stream";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <div className="flex items-center ">
            <ImFilesEmpty className="mr-2 h-3 w-3" />
            <p>Download</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-inter">
        <DialogHeader>
          <DialogTitle>Select File Type</DialogTitle>
          <DialogDescription>
            Choose the file type and month for the report generation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col gap-4">
            {/* File Type Options */}
            <div className="flex gap-4 items-center">
              <Button
                variant={"secondary"}
                className={
                  selectedFileType === "pdf"
                    ? "w-full bg-blue-200 border-blue-500 text-blue-500"
                    : "w-full"
                }
                onClick={() => setSelectedFileType("pdf")}
              >
                <div className="flex items-center ">
                  <BsFileEarmarkPdf className="mr-2 h-4 w-4" />
                  <p>PDF</p>
                </div>
              </Button>
              <Button
                variant={"secondary"}
                className={
                  selectedFileType === "excel"
                    ? "w-full bg-blue-200 border-blue-500 text-blue-500"
                    : "w-full"
                }
                onClick={() => setSelectedFileType("excel")}
              >
                <div className="flex items-center ">
                  <PiMicrosoftExcelLogoFill className="mr-2 h-4 w-4" />
                  <p>Excel</p>
                </div>
              </Button>
              <Button
                variant={"secondary"}
                className={
                  selectedFileType === "csv"
                    ? "w-full bg-blue-200 border-blue-500 text-blue-500"
                    : "w-full"
                }
                onClick={() => setSelectedFileType("csv")}
              >
                <div className="flex items-center ">
                  <PiFileCsvDuotone className="mr-2 h-4 w-4" />
                  <p>CSV File</p>
                </div>
              </Button>
            </div>

            {/* Select Component for Month and Year */}
            <Select onValueChange={(value: string) => setSelectedMonth(value)}>
              <SelectTrigger id="select-month" className="col-span-3">
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
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleDownload}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <span>Downloading...</span> // You can replace this with a spinner if needed
            ) : (
              "Print"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
