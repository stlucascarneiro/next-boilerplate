"use client";

import Box from "@/shared/Box";
import Button from "@/shared/Button.client";
import Checkbox from "@/shared/Checkbox";
import Chip from "@/shared/Chip.client";
import DetailRow from "@/shared/DetailRow";
import Dialog from "@/shared/Dialog.client";
import Drawer from "@/shared/Drawer.client";
import { Dropdown } from "@/shared/Dropdown.client";
import Header from "@/shared/Header.client";
import Input from "@/shared/Input.client";
import Multiselect from "@/shared/Multiselect.client";
import Select from "@/shared/Select.client";
import ThemeToggler from "@/shared/ThemeToggler.client";
import { useToast } from "@/shared/Toast.client";
import { IOption } from "@/shared/types/components.type";
import { FiAtSign } from "react-icons/fi";
import { PiHouseDuotone } from "react-icons/pi";

const options: IOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" },
  { label: "Option 5", value: "option5" },
  { label: "Option 6", value: "option6" },
  { label: "Option 7", value: "option7" },
  { label: "Option 8", value: "option8" },
];

export default function WorkbenchPage() {
  const { clearToasts, showToast } = useToast();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Box className="max-w-150">
        <Header
          rightContent={<ThemeToggler />}
          title="Workbench"
          titleHierarchy="h1"
        />
        <Select label="Select Label" name="test-select" options={options} />
        <Input
          label="Input Label"
          name="test-input"
          placeholder="Valor..."
          type="text"
        />
        <Input
          asideContent={
            <div className="text-subtle flex h-8 items-center rounded-r-md px-2">
              <FiAtSign />
            </div>
          }
          label="Input Label"
          name="test-input-aside"
          placeholder="Valor..."
          type="text"
        />
        <Multiselect
          label="Multiselect Label"
          name="test-multiselect"
          options={options}
        />
        <Checkbox label="Checkbox Label" name="test-checkbox" />

        <Button icon={<PiHouseDuotone />}>Button</Button>
        <Button icon={<PiHouseDuotone />}></Button>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              showToast({
                description: "Dados gravados com sucesso.",
                title: "Sucesso",
                variant: "success",
              });
            }}
            variant="primary"
          >
            Toast Success
          </Button>
          <Button
            onClick={() => {
              showToast({
                description: "Não foi possível concluir a operação.",
                title: "Erro",
                variant: "error",
              });
            }}
            variant="danger"
          >
            Toast Error
          </Button>
          <Button
            onClick={() => {
              showToast({
                description: "Você tem alterações pendentes.",
                title: "Atenção",
                variant: "warning",
              });
            }}
            variant="secondary"
          >
            Toast Warning
          </Button>
          <Button
            onClick={() => {
              showToast({
                description: "Seu perfil foi sincronizado.",
                title: "Informação",
                variant: "info",
              });
            }}
            variant="ghost"
          >
            Toast Info
          </Button>
          <Button onClick={clearToasts} variant="ghost">
            Limpar Toasts
          </Button>
        </div>
        <Drawer>
          <Drawer.Trigger icon={<PiHouseDuotone />} variant="secondary">
            Open Drawer
          </Drawer.Trigger>
          <Drawer.Content>
            <div className="flex h-full flex-col gap-4 p-4">
              <h3 className="text-base font-semibold">Drawer title</h3>
              <p className="text-subtle text-sm">
                Use this area for contextual actions or details.
              </p>
            </div>
          </Drawer.Content>
        </Drawer>

        <DetailRow label="Nome" value="John Doe" />
        <DetailRow
          complementary="Dolore minim reprehenderit reprehenderit adipisicing."
          icon={<PiHouseDuotone />}
          label="Label"
          value="InfoRow Value"
        />
        <DetailRow
          complementary="Dolore minim reprehenderit reprehenderit adipisicing."
          icon={<PiHouseDuotone />}
          value="InfoRow Value"
        />
      </Box>
      {/* <Button icon={PiHouseDuotone}>Botão</Button> */}
      <Chip clickable>Chip</Chip>
      <Dropdown placement="right">
        <Dropdown.Trigger>Trigger</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Item>Item 2</Dropdown.Item>
          <Dropdown.Item>Item 3</Dropdown.Item>
          <Dialog>
            <Dialog.Trigger variant="danger" width="full">
              Abrir dialog
            </Dialog.Trigger>
            <Dialog.Content
              closeLabel="Cancelar"
              confirmLabel="Excluir"
              description="Essa ação não poderá ser desfeita."
              onConfirm={async () => {
                // lógica de exclusão
              }}
              title="Excluir recurso"
              variant="alert"
            >
              Conteúdo adicional aqui...
            </Dialog.Content>
          </Dialog>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
