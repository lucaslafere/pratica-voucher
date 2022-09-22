import voucherRepository from "../../src/repositories/voucherRepository";
import voucherService from "../../src/services/voucherService";
import { faker } from "@faker-js/faker";
import {conflictError} from '../../src/utils/errorUtils'

describe("Teste unitário do voucher", () => {
  it("Testa se o voucher é criado corretamente", async () => {
    const voucher = {
      code: faker.name.firstName(),
      discount: faker.datatype.number({ min: 1, max: 100, precision: 1 }),
      id: faker.datatype.number(),
      used: false,
    };
    await voucherService.createVoucher(voucher.code, voucher.discount);

    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockResolvedValueOnce(voucher);

    expect(voucher).toBeTruthy();
  });



  it("Testa se o código de desconto é único", async () => {
    const discount = 10;
    const code = "aaaaaaaaaa"
        jest.spyOn(voucherRepository, 'getVoucherByCode')
        .mockResolvedValueOnce({
            id: 1,
            discount: discount,
            code: code,
            used: false
        })
    
        try {
            await voucherService.createVoucher(
                code,
                discount
              );
        } catch (error) {
            expect(error).toEqual(conflictError('Voucher already exist.'));
        }
    
  });
  it("Testa se o voucher já foi usado", async () => {
    const discount = 10;
    const code = "aaaaaaaaaa"
    const amount = 400
    jest.spyOn(voucherRepository, 'getVoucherByCode')
    .mockResolvedValueOnce({
            id: 1,
            discount: discount,
            code: code,
            used: true
    })
    try {
        await voucherService.applyVoucher(code, amount)
    } catch (error) {
        expect(error).toEqual(conflictError('Voucher already exist.'));
    }
  })
});
