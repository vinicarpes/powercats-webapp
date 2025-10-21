package com.powercatsui.powercatsui.models;

//import br.ifsc.edu.fln.iotprojectapi.dtos.AddressDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_address")
@EqualsAndHashCode(of = "id")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String postalCode;
    private String address; //todo street
    private String city;
    private String district;
    @Column(name = "state_name")
    private String state;
    private String nmbr;
    private String complement;


    //    public Address(AddressDTO addressDTO) {
//        this.postalCode = addressDTO.postalCode();
//        this.address = addressDTO.address();
//        this.city = addressDTO.city();
//        this.district = addressDTO.district();
//        this.state = addressDTO.state();
//        this.nmbr = addressDTO.nmbr();
//        this.complement = addressDTO.complement();
//    }
//
//    public void atualizarInformacoes(AddressDTO addressDTO) {
//        if (addressDTO == null) return;
//
//        if (addressDTO.postalCode() != null && !addressDTO.postalCode().isBlank()) {
//            this.postalCode = addressDTO.postalCode();
//        }
//        if (addressDTO.address() != null && !addressDTO.address().isBlank()) {
//            this.address = addressDTO.address();
//        }
//        if (addressDTO.city() != null && !addressDTO.city().isBlank()) {
//            this.city = addressDTO.city();
//        }
//        if (addressDTO.district() != null && !addressDTO.district().isBlank()) {
//            this.district = addressDTO.district();
//        }
//        if (addressDTO.state() != null && !addressDTO.state().isBlank()) {
//            this.state = addressDTO.state();
//        }
//        if (addressDTO.nmbr() != null && !addressDTO.nmbr().isBlank()) {
//            this.nmbr = addressDTO.nmbr();
//        }
//        if (addressDTO.complement() != null && !addressDTO.complement().isBlank()) {
//            this.complement = addressDTO.complement();
//        }
//    }
}
